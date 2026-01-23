import { ChatBubbleBottomCenterTextIcon, CommandLineIcon, ArrowTopRightOnSquareIcon, XMarkIcon, DocumentIcon, UserCircleIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import type { AFEHistorySupabaseType } from 'src/types/interfaces';
import { setAFEHistoryMaxID } from 'src/helpers/helpers';
import { insertAFEHistory } from 'provider/write'
import { useSupabaseData } from 'src/types/SupabaseContext';
import { SingleCheckbox } from 'src/routes/sharedComponents/singleCheckbox';
import { fetchAFEHistoryCount } from 'provider/fetch';
import { AFEHistoryBlock } from 'src/routes/sharedComponents/shatedUIBlocks';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { NotificationsGridPreFiltered } from 'src/routes/notifications';


type AFEHistoryProps = {
    historyAFEs: AFEHistorySupabaseType[];
    apc_afe_id: string;
    userName?: string;
    maxRowsToShow: number;
    onlyShowRecentFileHistory: boolean;
    hideCommentBox: boolean;
};

export default function AFEHistory({ historyAFEs, apc_afe_id, userName, maxRowsToShow, onlyShowRecentFileHistory, hideCommentBox }: AFEHistoryProps) {
    
    //User session information for adding a comment
    const { session } = useSupabaseData();
    const token = session?.access_token ?? "";
    //Status for dialog box
    const [open, setOpen] = useState(false);
    
    const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[]>([]);
    //Unfiltered AFE History
    const [unfilteredAFEHistory, setUnfilteredAFEHistory] = useState<AFEHistorySupabaseType[]>(historyAFEs);
    const [onlyRecentAFEDocViewHistory, setOnlyRecentAFEDocViewHistory] = useState(false);
    const [hideAFEActions, setHideAFEActions] = useState(false);
    const [hideAFEComments, setHideAFEComments] = useState(false);
    const [hideAFEFileActions, setHideAFEFileActions] = useState(false);
    const [commentVal, setCommentVal] = useState('');
    const [totalAFEHistoryCount, setTotalAFEHistoryCount] = useState(0);
    const [totalAFEHistoryDocFilteredCount, setTotalAFEHistoryDocFilteredCount] = useState(0);
    const [maxAFEHistoryRange, setMaxAFEHistoryRange] = useState(maxRowsToShow);
    const [totalAFEActionCount, setTotalAFEActionCount] = useState(0);
    const [totalAFECommentCount, setTotalAFECommentCount] = useState(0);
    const [totalDocumentActionsCount, setTotalDocumentActionsCount] = useState(0);
    const [totalRecentDocumentActionsCount, setTotalRecentDocumentActionsCount] = useState(0);

    useMemo(() => {
      async function getAFEHistoryRowCount() {
        setTotalAFEHistoryCount(historyAFEs.length);
      }; getAFEHistoryRowCount();
      
    },[historyAFEs])
    console.log(totalAFEHistoryCount,'total oount')

    useEffect(() => {
        if (onlyShowRecentFileHistory) {
            const filteredAFEHistory = filterAFEHistory(historyAFEs).slice().sort((a, b) => b.id - a.id).slice(0, maxAFEHistoryRange).sort((a, b) => a.id - b.id);
            setHistory(filteredAFEHistory);
        } else {
        const filteredAFEHistory = historyAFEs.slice().sort((a, b) => b.id - a.id).slice(0, maxAFEHistoryRange).sort((a, b) => a.id - b.id);
        setHistory(filteredAFEHistory);
        }
    }, [historyAFEs, maxAFEHistoryRange]);
    

    const afeHistoryMaxId: number = setAFEHistoryMaxID(unfilteredAFEHistory);

    const filterAFEHistory = (afeHistories: AFEHistorySupabaseType[]) => {
        const applyFilters = afeHistories.filter(afeHistory => {
            
            const documentFilter = afeHistory.type.includes('file');

            setTotalDocumentActionsCount(afeHistories.filter(afeHistory => afeHistory.type.includes('file')).length);
            return documentFilter ;
        })

        const maxIDDocView = afeHistories.reduce<Record<string, AFEHistorySupabaseType>>((acc, curr) => {
        const key = `${curr.user}-${curr.description}-${curr.type}`
  
        if (!acc[key] || curr.id > acc[key].id) {
            acc[key] = curr;
        }
  
        return acc;
        }, {});
    setTotalAFEHistoryDocFilteredCount(Object.keys(maxIDDocView).length);
    setTotalRecentDocumentActionsCount(Object.keys(maxIDDocView).filter(afeHistory => afeHistory.includes('file')).length);  
    
    return Object.values(maxIDDocView);
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentVal(event.target.value);
    };

    function handleComment() {
        setAFEHistoryMaxID(afeHistories);
        const newComment: AFEHistorySupabaseType = { id: afeHistoryMaxId, afe_id: apc_afe_id, user: 'You', description: commentVal, type: "comment", created_at: new Date() };
        setHistory([...afeHistories, newComment]);
        insertAFEHistory(apc_afe_id, commentVal, 'comment', token);
        setCommentVal('');
    };

    return (
        <>
            <div className="h-full flex flex-col">
                {/* History feed 
                <div className='mr-1 grid grid-cols-1 2xl:grid-cols-5 gap-x-0 gap-y-2 mb-4 mt-4 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:rounded-lg px-2 py-3 text-xs/5 2xl:text-sm/6'>
                    
                    <div className="justify-start col-span-2 flex flex-row-reverse gap-2 py-0 px-0">
                          <SingleCheckbox 
                            value={!hideAFEActions}
                            onChange={(hideAFEActions) => setHideAFEActions(!hideAFEActions)}
                            label={`Show AFE Actions (${totalAFEActionCount})`}
                            id={'hideAFEActions'}>
                          </SingleCheckbox>
                    </div>
                    
                    <div className="justify-start col-span-3 flex flex-row-reverse gap-2 py-0 px-0">
                          <SingleCheckbox 
                            value={!hideAFEFileActions}
                            onChange={(hideAFEFileActions) => setHideAFEFileActions(!hideAFEFileActions)}
                            label={`Include Document Actions (${totalDocumentActionsCount})`}
                            id={'hideAFEFileActions'}>
                          </SingleCheckbox>
                    </div>
                    <div className="justify-start col-span-2 flex flex-row-reverse gap-2 py-0 px-0">
                          <SingleCheckbox 
                            value={!hideAFEComments}
                            onChange={(hideAFEComments) => setHideAFEComments(!hideAFEComments)}
                            label={`Show Comments (${totalAFECommentCount})`}
                            id={'hideAFEComments'}>
                          </SingleCheckbox>
                    </div>
                    <div className="justify-start col-span-3 flex flex-row-reverse gap-2 py-0 px-0">
                          <SingleCheckbox 
                            value={onlyRecentAFEDocViewHistory}
                            onChange={(onlyRecentAFEDocViewHistory) => setOnlyRecentAFEDocViewHistory(onlyRecentAFEDocViewHistory)}
                            label={`Only Latest Document Action* (${totalRecentDocumentActionsCount})`}
                            id={'onlyRecentAFEDocViewHistory'}>
                          </SingleCheckbox>
                    </div>
                    <div className='2xl:col-span-5 text-right -mt-2 font-light custom-style-info text-[var(--darkest-teal)] sm:text-right text-xs/5'>
                        *Defaulted to show each user’s most recent document view/download
                    </div>

                    <div className='2xl:col-span-5 flex flex-row justify-end items-center text-right -mb-2 font-medium custom-style text-[var(--darkest-teal)] sm:text-right text-xs/5 2xl:text-sm/6'>
                        <div className='pr-2'>Complete AFE History</div>
                        <ArrowTopRightOnSquareIcon aria-hidden="true" onClick={(e) => {
                                  setOpen(true)}} className="relative size-5 flex-none text-[var(--darkest-teal)]" />
                    </div>
                    
                </div>*/}
                <div className="overflow-y-auto flex-1 sm:max-h-130 sm:min-h-130">
                <ul role="list" className="mt-2 mr-1 space-y-4 mb-1 ">
                    {
                        afeHistories.map((afeHistory, afeHistoryIdx) => (
                            <li key={afeHistory.id} className="relative flex gap-x-4">
                                <div
                                    className={`${afeHistoryIdx === afeHistories.length - 1 ? 'h-6' : '-bottom-6'} absolute top-0 left-0 flex w-6 justify-center`}>
                                    <div className="w-px bg-[var(--darkest-teal)]/40" />
                                </div>
                                {afeHistory.type === 'action' ? (
                                    <>
                                        <UserCircleIcon aria-hidden="true" className="relative size-6 flex-none bg-white text-[var(--darkest-teal)]" />
                                        <div className="flex-auto rounded-md p-1.5 ring-1 ring-opacity-10 ring-[var(--darkest-teal)] ">
                                        <AFEHistoryBlock
                                        user={afeHistory.user}
                                        created_at={afeHistory.created_at}
                                        description={afeHistory.description}
                                        ></AFEHistoryBlock>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                                            {afeHistory.type === 'comment' ? (
                                                <ChatBubbleBottomCenterTextIcon aria-hidden="true" className="size-6 text-[var(--bright-pink)]" />
                                            ) : (
                                                <DocumentIcon aria-hidden="true" className="relative size-6 flex-none bg-white text-[var(--darkest-teal)]" />
                                            )}
                                        </div>
                                        <div className="flex-auto rounded-md p-1.5 ring-1 ring-opacity-10 ring-[var(--bright-pink)]">
                                        <AFEHistoryBlock
                                        user={afeHistory.user}
                                        created_at={afeHistory.created_at}
                                        description={afeHistory.description}
                                        ></AFEHistoryBlock>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))

                    }
                </ul>
                
                {/* New comment form */}
                <div hidden={hideCommentBox} className="mt-4 sm:mt-10 flex gap-x-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--bright-pink)] bg-[var(--darkest-teal)] text-sm font-medium text-white ">
                        {userName?.charAt(0)}
                    </span>
                    <div className="relative flex-auto">
                        <div className="overflow-hidden rounded-lg pb-12 outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 bg-white shadow-2xl focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                            <label htmlFor="comment" className="sr-only">
                                Add your comment
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows={2}
                                placeholder="Add your comment..."
                                className="block w-full resize-none bg-transparent px-3 py-1.5 text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] placeholder:text-[var(--darkest-teal)]/50 focus:outline-none custom-style"
                                value={commentVal}
                                onChange={handleCommentChange}
                            />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pr-2 pl-3 ">
                            <button
                                disabled={commentVal === '' ? true : false}
                                type="submit"
                                className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                                onClick={handleComment}>
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
                </div>
                {/* Load More Button */}
                <div
                    className="mt-4 -mb-8 flex items-center justify-between border-t border-[var(--darkest-teal)]/30 py-4">
                    <div className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                    Showing {afeHistories.length} of {totalAFEHistoryCount}
                    <br></br><span className='text-xs/6' hidden={!onlyShowRecentFileHistory}>*Hiding {totalAFEHistoryCount-totalAFEHistoryDocFilteredCount} repetative histories</span>
                    </div>
                    <button
                        
                        onClick={async (e: any) => {
                            e.preventDefault();
                            setOpen(true)
                            //setMaxAFEHistoryRange(maxAFEHistoryRange + 5 <= totalAFEHistoryCount ? maxAFEHistoryRange + 5 : totalAFEHistoryCount);
                        }}
                        className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                        Full History
                    </button>
                </div>
            </div>
            <div className="relative h-full">
                  <Dialog open={open} onClose={setOpen} className="relative z-10">
                    <div className="fixed inset-0" />
                    <div className="fixed inset-0 overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed top-0 bottom-0 right-0 flex max-w-full pl-10 sm:pl-16 items-start pt-20">
                          <DialogPanel
                            transition
                            className="pointer-events-auto w-screen max-w-7xl h-full transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
                          >
                            <div className="relative flex flex-col overflow-y-auto bg-[var(--dark-teal)]/85 py-6 shadow-xl max-h-[calc(95vh-5rem)] shadow-lg ring-3 ring-[var(--darkest-teal)]/9 rounded-lg">
                              <div className="px-4 sm:px-6">
                                <div className="flex items-start justify-between">
                                  <DialogTitle className="text-base font-semibold text-gray-900"></DialogTitle>
                                  <div className="ml-3 flex h-3 items-center">
                                    <button
                                      type="button"
                                      onClick={() => {setOpen(false)}}
                                      className="relative rounded-md text-white/70 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    >
                                      <span className="absolute -inset-2.5" />
                                      <span className="sr-only">Close panel</span>
                                      <XMarkIcon aria-hidden="true" className="size-6" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="relative mt-6 flex-1 px-4 sm:px-4 overflow-y-auto">
                                <NotificationsGridPreFiltered
                                    apc_afe_id={apc_afe_id}
                                ></NotificationsGridPreFiltered>
                              </div>
                            </div>
                          </DialogPanel>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                </div>
        </>
    )
}

