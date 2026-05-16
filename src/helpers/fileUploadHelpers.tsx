import type { AddressType, GLCodeRowData, OperatorType, PartnerRowData, UnrelatedPartnerRowData } from 'src/types/interfaces';
import * as XLSX from 'xlsx';

export function validateHeaders(worksheet: XLSX.WorkSheet, expectedHeaders: string[]): { valid: boolean, firstRow: string[] } {
    const firstRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
    const valid = expectedHeaders.every((expected, i) =>
        String(firstRow?.[i] ?? '').trim().toLowerCase() === expected.toLowerCase()
    );
    return { valid, firstRow };
};

export function parseRowsToPartnerData(
    worksheet: XLSX.WorkSheet,
    opAPCIDArray: string[]
): PartnerRowData[] {
    const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
    }) as unknown[][]

    const dataRows = rows.slice(1).filter(row => String(row[0] ?? '').trim() !== '');

    return dataRows.flatMap<PartnerRowData>((row) => {
        const basic = {
            source_id: String(row[0] ?? ''),
            apc_op_id: '',
            name: String(row[1] ?? ''),
            street: String(row[2] ?? ''),
            suite: String(row[3] ?? ''),
            city: String(row[4] ?? ''),
            state: String(row[5] ?? ''),
            zip: String(row[6] ?? ''),
            country: String(row[7] ?? ''),
            active: true,
        }
        return opAPCIDArray.map<PartnerRowData>((operator) => ({
            ...basic,
            apc_op_id: operator
        }))
    })
};

type ParsedPartnerData = {
    partnerRows: UnrelatedPartnerRowData[];
    operatorRows: { operator: OperatorType; address: AddressType }[];
};

export function parseRowsToUnrelatedPartnerData(
    worksheet: XLSX.WorkSheet
): ParsedPartnerData {
    const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
    }) as unknown[][]

    const dataRows = rows.slice(1).filter(row => String(row[0] ?? '').trim() !== '');

    const partnerRowsExtract = dataRows.flatMap<UnrelatedPartnerRowData>((row) => {
        const basic = {
            name: String(row[0] ?? ''),
            street: String(row[1] ?? ''),
            suite: String(row[2] ?? ''),
            city: String(row[3] ?? ''),
            state: String(row[4] ?? ''),
            zip: String(row[5] ?? ''),
            country: String(row[6] ?? ''),
            active: true,
        }
        return basic;
    });

    const partnerRows = getDistinctUnrelatedpartnersItemsByProperties(partnerRowsExtract, ["name", "street", "suite", "city", "state", "zip", "country"]);

    const operatorRows = partnerRows.map((row) => ({
        operator: {
            name: row.name,
        } as OperatorType,
        address: {
            street: row.street,
            suite: row.suite,
            city: row.city,            
            state: row.state,
            zip: row.zip,
            country: row.country,
            address_active: true,
        } as AddressType,
    }));

    return { partnerRows, operatorRows };
};

export function parseRowsToAccountData(
    worksheet: XLSX.WorkSheet,
    opAPCIDArray: string[],
    partnerAPCIDArray: string[],
): GLCodeRowData[] {
    const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
    }) as unknown[][]

    
    const dataRows = rows.slice(1).filter(row => String(row[0] ?? '').trim() !== '');

    const accountsToOperators: GLCodeRowData[] = dataRows.flatMap<GLCodeRowData>((row) => {
            const basic = {
              account_number: String(row[0] ?? ''),
              account_group: String(row[1] ?? ''),
              account_description: String(row[2] ?? ''),
              apc_op_id: '',
              apc_part_id: ''
            };
    
            const looped = opAPCIDArray.map<GLCodeRowData>((operator) => ({
              ...basic,
              apc_op_id: operator,
              apc_part_id: null
            }))
    
            return looped;
    });
    
    const accountsToPartners: GLCodeRowData[] = dataRows.flatMap<GLCodeRowData>((row) => {
            const basic = {
              account_number: String(row[0] ?? ''),
              account_group: String(row[1] ?? ''),
              account_description: String(row[2] ?? ''),
              apc_op_id: '',
              apc_part_id: ''
            };
    
            const looped = partnerAPCIDArray.map<GLCodeRowData>((partner) => ({
              ...basic,
              apc_op_id: null,
              apc_part_id: partner
            }))
    
            return looped;
    });

    return [...accountsToOperators, ...accountsToPartners];
};

export function getDistinctItemsByProperties(
    arr: PartnerRowData[],
    props: Array<keyof PartnerRowData>
  ): PartnerRowData[] {
    const seen = new Set<string>();
    const distinctItems: PartnerRowData[] = [];

    for (const item of arr) {
      const identifier = props.map((p) => item[p]).join("|"); 
      if (!seen.has(identifier)) {
        seen.add(identifier);
        distinctItems.push(item);
      }
    }
    return distinctItems;
};

export function getDistinctUnrelatedpartnersItemsByProperties(
    arr: UnrelatedPartnerRowData[],
    props: Array<keyof UnrelatedPartnerRowData>
  ): UnrelatedPartnerRowData[] {
    const seen = new Set<string>();
    const distinctItems: UnrelatedPartnerRowData[] = [];

    for (const item of arr) {
      const identifier = props.map((p) => item[p]).join("|"); 
      if (!seen.has(identifier)) {
        seen.add(identifier);
        distinctItems.push(item);
      }
    }
    return distinctItems;
};

export function getDistinctAccountsByProperties(
    arr: GLCodeRowData[],
    props: Array<keyof GLCodeRowData>
  ): GLCodeRowData[] {
    const seen = new Set<string>();
    const distinctItems: GLCodeRowData[] = [];

    for (const item of arr) {
      const identifier = props.map((p) => item[p]).join("|"); 
      if (!seen.has(identifier)) {
        seen.add(identifier);
        distinctItems.push(item);
      }
    }
    return distinctItems;
};

export function readWorkbook(arrayBuffer: ArrayBuffer): {
    workbook: XLSX.WorkBook,
    worksheet: XLSX.WorkSheet
} {
    const data = new Uint8Array(arrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    return { workbook, worksheet }
};