import { useEffect, useState } from "react";
import type { PartnerRowData } from 'src/types/interfaces';
import { updatePartnerActiveStatus } from 'provider/write';
import UniversalPagination from 'src/routes/sharedComponents/pagnation';
import { OperatorDropdown } from 'src/routes/sharedComponents/operatorDropdown';
import { fetchSourceSystemPartners } from "provider/fetch";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { SingleCheckbox } from "src/routes/sharedComponents/singleCheckbox";
import { notifyFailure, notifyStandard } from "src/helpers/helpers";
import { useSupabaseData } from "src/types/SupabaseContext";
import { transformPartnerSourceSystemAddress } from "src/types/transform";

const headers = ["Source_id","Name", "Street", "Suite", "City", "State", "Zip", "Country",""];

export default function PartnerLibrary() {
  const { session } = useSupabaseData();
  const token = session?.access_token ?? "";
  const [rowsLimit] = useState(50);
  const [rowsToShow, setRowsToShow] = useState<PartnerRowData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [opAPCID, setOpAPCID] = useState<string>('');
  const [partnerList, setPartnerList] = useState<PartnerRowData[] | []>([]);
  const [partnerAPCID, setPartnerAPCID] = useState<string>('');
  const [hideDeletedPartners, setHideDeletedPartners] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (paginatedData: PartnerRowData[], page: number) => {
    setRowsToShow(paginatedData);
    setCurrentPage(page);
  };

  async function getPartners() {
    if (opAPCID === '' || token === '') return;
    setLoading(true);
    try {
        const partnerList = await fetchSourceSystemPartners(opAPCID, token);

        if(partnerList.ok) {
          const dataTransformed = transformPartnerSourceSystemAddress(partnerList.data);
          const sourcePartListSorted = dataTransformed.sort((a,b) => {
              if (a.name === undefined && b.name === undefined) {
                  return 0;
              }
              if (a.name === undefined) {
                  return 1;
              }
              if (b.name === undefined) {
                  return -1;
              }
              return (a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }));
          });
            setPartnerList(sourcePartListSorted);
        }
    } finally {
        setLoading(false);
    }
  };

  async function handleDeletePartner(partnerIdx: number, status: boolean) {
    try{
      const updatePartnerResult = await updatePartnerActiveStatus(partnerIdx, status, token);
        if(updatePartnerResult.ok) {
          getPartners();
          notifyStandard(`Partner changes saved. Link established and the system didn’t even hiccup.\n\n(TLDR: Partner changes ARE saved)`);
        }
        if(!updatePartnerResult.ok) {
          notifyFailure(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR saving the partner changes: ${updatePartnerResult.message})`);
        return;
        }
    } catch(error) {
        const err = error as Error
        const parsed = JSON.parse(err.message)
        notifyFailure(`Well shut-in, no data flowed to the database\n\n(TLDR: ERROR saving the partner changes: ${parsed.message})`);
    } finally{
      return;
    }
  };

  useEffect(() => {
    if (opAPCID === '') return;
    getPartners();
  }, [opAPCID]);

  return (
    <>
      <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
          <div className="">
            <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">View the Partner Libraries for Operated AFEs</h2>
            <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Sentance </p>
            <br></br><p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">Sentace</p>
          </div>

          <div className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 ">
            <div className="flex flex-col lg:flex-row">
              <div className='w-1/2 m-2 '>
                <h1 className="text-base/7 font-medium text-[var(--darkest-teal)] custom-style">Select the Operator for Operated AFEs</h1>
               <OperatorDropdown
                value={opAPCID}
                onChange={(id) => { setOpAPCID(id) }}
                limitedList={true}
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div hidden={opAPCID === '' ? true : false } 
      className="mt-5 bg-white">
        <table className="table-auto min-w-full ring-1 ring-[var(--darkest-teal)]/70 rounded-t-md">
          <thead>
            <tr>
              {headers.map((header, headerIdx) => (
                <th key={headerIdx} scope="col" className={`border border-[var(--darkest-teal)]/30 custom-style font-medium ${headerIdx === 0 ? 'sm:table-cell' : headerIdx === 1 ? 'sm:table-cell' : 'hidden sm:table-cell'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-b border-b-[var(--darkest-teal)]/30">
            {rowsToShow.map((partnerRow, partnerIdx) => (
              <tr key={partnerIdx} 
              hidden={hideDeletedPartners && !partnerRow.active ? true : false}
              className="text-end sm:text-start custom-style-long-text border-l border-l-[var(--darkest-teal)]/30 even:bg-[var(--darkest-teal)]/20">
                <td scope="col" className="text-start pl-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.source_id}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.name}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.street}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.suite}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.city}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.state}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.zip}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">{partnerRow.country}</td>
                <td scope="col" className="px-2 border-r border-r-[var(--darkest-teal)]/30">
                  <div hidden={partnerRow.active ? false : true}
                    className="m-1 flex items-center justify-center pt-1 group relative">
                    <button
                      onClick={e => handleDeletePartner(partnerRow.id!, !partnerRow.active)}
                      className="text-red-500 hover:text-red-900 cursor-pointer ">
                      <TrashIcon className="size-5" />
                    </button>
                    <div className="invisible group-hover:visible opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300
                    absolute bottom-full left-1/2 -translate-x-1/2
                    mb-2 p-2 bg-[var(--bright-pink)] text-white text-sm rounded
                    whitespace-nowrap">
                      Delete the partner
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[var(--bright-pink)]">
                      </div>
                    </div>
                  </div>
                  <div hidden={partnerRow.active ? true : false}
                    className="m-1 flex items-center justify-center pt-1 group relative">
                    <button
                      onClick={e => handleDeletePartner(partnerRow.id!, !partnerRow.active)}
                      className="text-[var(--darkest-teal)] hover:text-[var(--darkest-teal)] cursor-pointer ">
                      <PlusCircleIcon className="size-5" />
                    </button>
                    <div className="invisible group-hover:visible opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300
                    absolute bottom-full left-1/2 -translate-x-1/2
                    mb-2 p-2 bg-[var(--bright-pink)] text-white text-sm rounded
                    whitespace-nowrap">
                      Bring back from the dead
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[var(--bright-pink)]">
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="pt-6"
        hidden={partnerList.length===0 ? true : false}>
        <UniversalPagination
          data={partnerList}
          rowsPerPage={rowsLimit}
          listOfType="Partners"
          onPageChange={handlePageChange}
        />
        </div>
        <div className="flex flex-row-reverse justify-start gap-3 py-6 px-0">
          <SingleCheckbox
            value={hideDeletedPartners}
            onChange={(hideDeletedPartners) => setHideDeletedPartners(hideDeletedPartners)}
            label={'Hide Deleted Partners'}
            id={'hideDeletedPartners'}>
          </SingleCheckbox>
        </div>
      </div>
    </>
  )
}