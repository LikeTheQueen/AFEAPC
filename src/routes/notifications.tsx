import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExportWithTemplate() {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  
  const handleExport = async () => {
    
    let estimates = [
    {
        "id": 3510,
        "amount_gross": 0,
        "partner_wi": 20,
        "partner_net_amount": 0,
        "operator_account_number": "9210.201",
        "operator_account_description": "LICENCE, FEES, TAXES, & PERMITS",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3506,
        "amount_gross": 2222,
        "partner_wi": 20,
        "partner_net_amount": 444.4,
        "operator_account_number": "9210.202",
        "operator_account_description": "SURFACE LEASE ACQUISITION",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3536,
        "amount_gross": 0,
        "partner_wi": 20,
        "partner_net_amount": 0,
        "operator_account_number": "9210.203",
        "operator_account_description": "SURVEYING",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3550,
        "amount_gross": 0,
        "partner_wi": 20,
        "partner_net_amount": 0,
        "operator_account_number": "9210.207",
        "operator_account_description": "ROAD & SITE COSTS",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3500,
        "amount_gross": 0,
        "partner_wi": 20,
        "partner_net_amount": 0,
        "operator_account_number": "9210.208",
        "operator_account_description": "ROAD USE",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3534,
        "amount_gross": 0,
        "partner_wi": 20,
        "partner_net_amount": 0,
        "operator_account_number": "9210.212",
        "operator_account_description": "DRILLING RIG",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3514,
        "amount_gross": 0,
        "partner_wi": 20,
        "partner_net_amount": 0,
        "operator_account_number": "9210.225",
        "operator_account_description": "DRILL BITS",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3524,
        "amount_gross": 0,
        "partner_wi": 20,
        "partner_net_amount": 0,
        "operator_account_number": "9210.230",
        "operator_account_description": "DRILLING MUD / FLUID / CHEMICAL",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    },
    {
        "id": 3512,
        "amount_gross": 111.1,
        "partner_wi": 20,
        "partner_net_amount": 22.22,
        "operator_account_number": "9210.299",
        "operator_account_description": "ADMINISTRATIVE OVERHEAD",
        "operator_account_group": "1. DRILLING",
        "partner_account_number": null,
        "partner_account_description": null,
        "partner_account_group": null
    }
    ];
    const estimatesExport = () => {
      return estimates.map(item => ({
        operator_Account_Description: item.operator_account_description,
        operator_Account_Group: item.operator_account_group,
        operator_Account_Number: item.operator_account_number,
        account_Description: item.partner_account_description,
        account_Group: item.partner_account_group,
        account_Number: item.partner_account_number,
        gross_amount: item.amount_gross,
        net_amount: item.partner_net_amount
      }))
    };
      const ws = XLSX.utils.json_to_sheet(estimatesExport());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Export");
      XLSX.writeFile(wb, "export.xlsx");
    
  };
  
  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleExport}>
        Export {templateFile ? 'with Template' : 'with Default'}
      </button>
    </div>
  );
}