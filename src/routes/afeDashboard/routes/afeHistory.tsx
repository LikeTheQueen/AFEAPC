import { ChatBubbleBottomCenterTextIcon, CommandLineIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import type { AFEHistorySupabaseType } from 'src/types/interfaces';
import { setAFEHistoryMaxID } from 'src/helpers/helpers';
import { insertAFEHistory } from 'provider/write'
import { useSupabaseData } from 'src/types/SupabaseContext';
import { SingleCheckbox } from 'src/routes/sharedComponents/singleCheckbox';
import { fetchAFEHistoryCount } from 'provider/fetch';


type AFEHistoryProps = {
    historyAFEs: AFEHistorySupabaseType[];
    apc_afe_id: string;
    userName?: string;
};

export default function AFEHistory({ historyAFEs, apc_afe_id, userName }: AFEHistoryProps) {
    const { session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[]>(historyAFEs);
    const [onlyRecentAFEDocViewHistory, setOnlyRecentAFEDocViewHistory] = useState(true);
    const [hideAFEActions, setHideAFEActions] = useState(false);
    const [hideAFEComments, setHideAFEComments] = useState(false);
    const [hideAFEFileActions, setHideAFEFileActions] = useState(false);
    const [commentVal, setCommentVal] = useState('');
    const [totalAFEHistoryCount, setTotalAFEHistoryCount] = useState(0);
    const [totalAFEHistoryDocFilteredCount, setTotalAFEHistoryDocFilteredCount] = useState(0);
    const [maxAFEHistoryRange, setMaxAFEHistoryRange] = useState(3);
    const [totalAFEActionCount, setTotalAFEActionCount] = useState(0);
    const [totalAFECommentCount, setTotalAFECommentCount] = useState(0);
    const [totalDocumentActionsCount, setTotalDocumentActionsCount] = useState(0);

    useMemo(() => {
      async function getAFEHistoryRowCount() {
        const afeHistoryRowCountResult = await fetchAFEHistoryCount(apc_afe_id);
        setTotalAFEHistoryCount(afeHistoryRowCountResult);
      }; getAFEHistoryRowCount();
      
    },[])

    useEffect(() => {
        const orderAFEHistory = historyAFEs.sort((a: AFEHistorySupabaseType, b: AFEHistorySupabaseType) => a.id - b.id);
        const filteredAFEHistory = filterAFEHistory(orderAFEHistory).slice().sort((a, b) => b.id - a.id).slice(0, maxAFEHistoryRange).sort((a, b) => a.id - b.id);
        setHistory(filteredAFEHistory);
        setTotalAFEHistoryCount(historyAFEs.length);
    }, [historyAFEs, onlyRecentAFEDocViewHistory, hideAFEActions, hideAFEComments, hideAFEFileActions, maxAFEHistoryRange]);

    const afeHistoryMaxId: number = setAFEHistoryMaxID(afeHistories);

    const filterAFEHistory = (afeHistories: AFEHistorySupabaseType[]) => {
        const applyFilters = afeHistories.filter(afeHistory => {
            const commentsFilter = ((afeHistory.type === 'comment' && !hideAFEComments) || afeHistory.type !== 'comment');
            
            const actionFilter = ((afeHistory.type === 'action' && !hideAFEActions) || afeHistory.type !== 'action');
            
            const documentFilter = ((afeHistory.type.includes('file') && !hideAFEFileActions)
            || (!afeHistory.type.includes('file')));
            setTotalAFEActionCount(afeHistories.filter(afeHistory => afeHistory.type === 'action').length);
            setTotalAFECommentCount(afeHistories.filter(afeHistory => afeHistory.type === 'comment').length);
            setTotalDocumentActionsCount(afeHistories.filter(afeHistory => afeHistory.type.includes('file')).length)
            return commentsFilter && actionFilter && documentFilter;
        })
        const maxIDDocView = applyFilters.reduce<Record<string, AFEHistorySupabaseType>>((acc, curr) => {
        const key = `${curr.user}-${curr.description}-${curr.type}`
  
        if (!acc[key] || curr.id > acc[key].id) {
            acc[key] = curr;
        }
  
        return acc;
        }, {});
    setTotalAFEHistoryDocFilteredCount(Object.keys(maxIDDocView).filter(afeHistory => afeHistory.includes('file')).length);  
    console.log(Object.values(maxIDDocView))  
    return onlyRecentAFEDocViewHistory ? Object.values(maxIDDocView) : applyFilters;
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

console.log('TOTAL FILTERED',totalAFEHistoryDocFilteredCount);
console.log('the length', afeHistories.length)

    return (
        <>
            <div className="h-full flex flex-col">
                {/* History feed */}
                <div className='mr-1 grid grid-cols-1 2xl:grid-cols-5 gap-x-1 mb-4 mt-4 rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:rounded-lg px-2 py-3 text-xs/5 2xl:text-sm/6'>
                    
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
                            label={`Only Latest Document Action* (${totalAFEHistoryDocFilteredCount})`}
                            id={'onlyRecentAFEDocViewHistory'}>
                          </SingleCheckbox>
                    </div>
                    <div className='2xl:col-span-5 text-right -mb-2 font-light custom-style-info text-[var(--darkest-teal)] sm:text-right text-xs/5'>
                        *Defaulted to show each user’s most recent document view/download
                    </div>
                    
                </div>
                <div className="overflow-y-auto flex-1 sm:min-h-81 sm:max-h-81">
                <ul role="list" className="mt-2 mr-1 space-y-4 mb-1 ">
                    {
                        afeHistories?.map((afeHistory, afeHistoryIdx) => (
                            <li key={afeHistory.id} className="relative flex gap-x-4">
                                <div
                                    className={`${afeHistoryIdx === afeHistories.length - 1 ? 'h-6' : '-bottom-6'} absolute top-0 left-0 flex w-6 justify-center`}>
                                    <div className="w-px bg-[var(--darkest-teal)]/40" />
                                </div>
                                {afeHistory.type !== 'comment' ? (
                                    <>
                                        <CommandLineIcon aria-hidden="true" className="relative size-6 flex-none text-[var(--darkest-teal)]" />
                                        <div className="flex-auto rounded-md p-1.5 ring-1 ring-opacity-10 ring-[var(--darkest-teal)] ">
                                            <div className="flex justify-between gap-x-4">
                                                <div className="text-xs/6 2xl:text-sm/6">
                                                    <span className="font-medium text-[var(--darkest-teal)] custom-style-long-text">{afeHistory.user}</span>
                                                </div>
                                                <p className="sr-only 2xl:not-sr-only flex-none text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text ">{new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                })}</p>
                                                <p className="2xl:hidden flex-none text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text ">{new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}</p>

                                            </div>
                                            <p className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style-long-text italic">{afeHistory.description}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                                            {afeHistory.type === 'comment' ? (
                                                <ChatBubbleBottomCenterTextIcon aria-hidden="true" className="size-6 text-[var(--bright-pink)]" />
                                            ) : (
                                                <div className="size-1.5 rounded-full bg-gray-300 ring-1 ring-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-auto rounded-md p-1.5 ring-1 ring-opacity-10 ring-[var(--bright-pink)] truncate">
                                            <div className="flex justify-between gap-x-4">
                                                <div className=" text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)]">
                                                    <span className="font-medium text-[var(--darkest-teal)] custom-style-long-text">{afeHistory.user}</span>
                                                </div>
                                                <p className="sr-only 2xl:not-sr-only flex-none text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text text-clip">
                                                    {new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true,
                                                    })}</p>
                                                <p className="2xl:hidden flex-none text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text text-clip">
                                                    {new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</p>

                                            </div>
                                            <p className="text-xs/6 2xl:text-sm/6 font-normal text-[var(--darkest-teal)] custom-style-long-text italic">{afeHistory.description}</p>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))

                    }
                </ul>
                </div>
                {/* New comment form */}
                <div className="mt-6 flex gap-x-3">
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
                {/* Load More Button */}
                <div
                    className="mt-4 -mb-8 flex items-center justify-between border-t border-[var(--darkest-teal)]/30 py-4">
                    <div className="text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style font-medium">
                    Showing {afeHistories.length} of {totalAFEHistoryCount}
                    </div>
                    <button
                        disabled={onlyRecentAFEDocViewHistory ?
                            (afeHistories.length >= totalAFEHistoryDocFilteredCount ? true : false) :
                            (afeHistories.length >= totalAFEHistoryCount ? true : false)
                        }
                        onClick={async (e: any) => {
                            e.preventDefault();
                            setMaxAFEHistoryRange(maxAFEHistoryRange + 5 <= totalAFEHistoryCount ? maxAFEHistoryRange+5 : totalAFEHistoryDocFilteredCount);
                        }}
                        className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 text-xs/6 2xl:text-sm/7 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                        Load More
                    </button>
                </div>
            </div>
        </>
    )
}