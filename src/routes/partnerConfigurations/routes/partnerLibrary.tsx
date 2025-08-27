import { fetchPartnersLinkedOrUnlinkedToOperator } from "provider/fetch";
import { useEffect, useState } from "react";
import { type OperatorPartnerAddressType, type SourceSystemPartnerAddressType } from "src/types/interfaces";
import * as XLSX from 'xlsx';
import PartnerMapping from "./partnerMapping";
import PartnerFileUpload from "./partnerFileUpload";
import { Button } from "@headlessui/react";
import { activeTab } from "src/helpers/styleHelpers";
import { ChevronDownIcon } from '@heroicons/react/16/solid'


interface PartnerRowData {
  source_id: string;
  apc_op_id: string;
  name: string;
  street: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  active: boolean;
};
const expectedHeaders = ["Source_id","Name", "Street", "Suite", "City", "State", "Zip", "Country"];


export default function PartnerLibrary({selectedSubTab}:{ selectedSubTab: number; }) {
  const [partnersToMap, setPartnersToMap] = useState<SourceSystemPartnerAddressType[] | []>([]);
  const [apcPartnerList, setAPCPartnerList] = useState<OperatorPartnerAddressType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [selectedTabSub, setSelectedTabSub] = useState<number>(() => selectedSubTab);

  useEffect(() => {
    let isMounted = true;
    async function getPartnerLists() {
      setLoading(true);
      try {
        const apcPartList = await fetchPartnersLinkedOrUnlinkedToOperator();
        if (isMounted) {
          setAPCPartnerList(apcPartList ?? [])
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    getPartnerLists();
    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <>
   
    <div className="py-8 px-4 sm:px-16 " hidden={selectedSubTab !== 1}>
      <PartnerFileUpload></PartnerFileUpload>
    </div>
      <div className="py-8 px-4 sm:px-16" hidden={selectedSubTab !== 2}>
        <PartnerMapping></PartnerMapping>
      </div>
      <div className="py-8 px-4 sm:px-16" hidden={selectedSubTab !== 3}>
      <h2>View Mappings</h2>
    </div>
    </>
  )
}