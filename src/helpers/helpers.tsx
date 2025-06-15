import { fetchFromSupabase } from "provider/fetch";
import { addOperatorSupabase } from "provider/write";
import type { AFEHistorySupabaseType, AFEType, EstimatesSupabaseType } from "src/types/interfaces";
import { transformSourceSystemSupabase, transformUserProfileSupabase } from "src/types/transform";


export function setAFEHistoryMaxID(afeHistories: AFEHistorySupabaseType[] | []) {
  return afeHistories.length;
};

export function groupByAccountGroup(account: EstimatesSupabaseType[] | null): Map<string, EstimatesSupabaseType[]> | null {
  if (account !== null) {
    return account.reduce((map, accountItem) => {
      const accountGroup = accountItem.operator_account_group;
      if (!map.has(accountGroup)) {
        map.set(accountGroup, []);
      }
      map.get(accountGroup)!.push(accountItem);
      return map;
    }, new Map<string, EstimatesSupabaseType[]>());
  } else {
    return null;
  }
};

export function calcPartnerNet(gross: number | undefined, wi: number | undefined) {
  if (gross && wi) {
    return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((gross * wi) / 100);
  } else if (gross === undefined && wi) {
    return 'Missing gross amount';
  } else if (gross && wi === undefined) {
    return 'Missing working interest';
  } else {
    return 'Missing WI and gross amount';
  }
};

export function toggleStatusButtonDisable(singleAFE: AFEType | undefined | null) {
  if (singleAFE === null || singleAFE === undefined) {
    return false
  } else if (singleAFE?.partner_status === 'New' || singleAFE?.partner_status === 'Viewed') {
    return false
  } else {
    return true
  }
};

export function activeTab(tabList: any[], selected: number | null) {
  if(!selected) {
    const selectedTabId = tabList.find((tab)=> tab.current === true)?.id;
    const updatedTabs = tabList.map((tab) => ({
      ...tab,
      current: tab.id === selectedTabId,
    }));
    return {updatedTabs, selectedTabId}
  } else {
    console.log('psse tab');
    const selectedTabId = selected;
    const updatedTabs = tabList.map((tab) => ({
      ...tab,
      current: tab.id === selectedTabId,
    }));
    console.log('i upate ', updatedTabs)
    return {updatedTabs, selectedTabId}
  }

};

export async function sourceSystemList() {
  const rawSource = await fetchFromSupabase("SOURCE_SYSTEM","id, system");
  const fetchSource = transformSourceSystemSupabase(rawSource);
  return fetchSource;
}

export async function writeOperatorToSupabase (name: string, source_system:number) {
  const result = await addOperatorSupabase('Op4', 2);
  console.log(result, 'this is the result');
  return result;
}