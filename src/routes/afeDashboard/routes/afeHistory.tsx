import { ChatBubbleBottomCenterTextIcon, CommandLineIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import type { AFEHistorySupabaseType } from 'src/types/interfaces';
import { setAFEHistoryMaxID } from 'src/helpers/helpers';
import { insertAFEHistory } from 'provider/write'
import { useSupabaseData } from 'src/types/SupabaseContext';

 type AFEHistoryProps = {
   historyAFEs: AFEHistorySupabaseType[];
 };

export default function AFEHistory({ historyAFEs }: AFEHistoryProps) {
    const { session } = useSupabaseData();
    const token = session?.access_token ?? "";
    const [afeHistories, setHistory] = useState<AFEHistorySupabaseType[]>(historyAFEs);
    const [commentVal, setCommentVal] = useState('');
   
    useEffect(() => {
    setHistory(historyAFEs);    
   }, [historyAFEs]);


    const afeHistoryMaxId: number = setAFEHistoryMaxID(afeHistories);
    
    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentVal(event.target.value);
    };
    
    function handleComment() {
        setAFEHistoryMaxID(afeHistories);
        const newComment: AFEHistorySupabaseType = { id: afeHistoryMaxId, afe_id: historyAFEs[0].afe_id, user: 'You', description: commentVal, type: "comment", created_at: new Date() };
        setHistory([...afeHistories, newComment]);
        insertAFEHistory(historyAFEs[0].afe_id, commentVal, 'comment', token);
        setCommentVal('');
    };

    return (
        <>
            <div className="lg:col-start-3">
                {/* History feed */}
                <h2 className="font-semibold custom-style text-[var(--darkest-teal)]">AFE History</h2>
                <ul role="list" className="mt-6 space-y-6">
                    {
                     
                    afeHistories?.map((afeHistory, afeHistoryIdx) => (
                        <li key={afeHistory.id} className="relative flex gap-x-4">
                            <div
                            className={`${afeHistoryIdx === afeHistories.length - 1 ? 'h-6' : '-bottom-6'} absolute top-0 left-0 flex w-6 justify-center`}>
                                <div className="w-px bg-gray-200" />
                            </div>
                            {afeHistory.type === 'action' ? (
                                <>
                                    <CommandLineIcon aria-hidden="true" className="relative size-6 flex-none text-[var(--darkest-teal)]" />
                                    <div className="flex-auto rounded-md p-1.5 ring-1 ring-opacity-10 ring-[var(--darkest-teal)] ">
                                        <div className="flex justify-between gap-x-4">
                                            <div className="text-sm/6 ">
                                                <span className="font-medium text-[var(--darkest-teal)] custom-style-long-text">{afeHistory.user}</span>
                                            </div>
                                            <p className="sr-only 2xl:not-sr-only flex-none text-sm/6 text-gray-500 custom-style-long-text ">{new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}</p>
                                            <p className="2xl:hidden flex-none text-sm/6 text-gray-500 custom-style-long-text ">{new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}</p>

                                        </div>
                                        <p className="text-sm/6 text-gray-500 custom-style-long-text">{afeHistory.description}</p>
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
                                            <div className=" text-sm/6 text-gray-500">
                                                <span className="font-medium text-[var(--darkest-teal)] custom-style-long-text">{afeHistory.user}</span>
                                            </div>
                                            <p className="sr-only 2xl:not-sr-only flex-none text-sm/6 text-gray-500 custom-style-long-text text-clip">
                                            {new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}</p>
                                            <p className="2xl:hidden flex-none text-sm/6 text-gray-500 custom-style-long-text text-clip">
                                            {new Date(afeHistory.created_at).toLocaleDateString('en-us', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}</p>

                                        </div>
                                        <p className="text-sm/6 text-gray-500 custom-style-long-text">{afeHistory.description}</p>
                                    </div>
                                </>
                            )}
                        </li>
                    ))
                       
                    }
                </ul>
                {/* New comment form */}
                <div className="mt-6 flex gap-x-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--bright-pink)] bg-[var(--darkest-teal)] text-[1rem] font-medium text-white ">

                    </span>
                    <div className="relative flex-auto">
                        <div className="overflow-hidden rounded-lg pb-12 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                            <label htmlFor="comment" className="sr-only">
                                Add your comment
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows={2}
                                placeholder="Add your comment..."
                                className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-[var(--darkest-teal)] placeholder:text-gray-400 focus:outline-none sm:text-sm/6 custom-style"
                                value={commentVal}
                                onChange={handleCommentChange}
                            />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pr-2 pl-3 ">
                            <button
                                disabled={commentVal==='' ? true : false}
                                type="submit"
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold custom-style text-[var(--darkest-teal)] shadow-xs ring-1 ring-gray-300 ring-inset 
                                hover:bg-[var(--bright-pink)] hover:text-white
                                disabled:bg-gray-200 disabled:text-gray-400"
                                onClick={handleComment}>

                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}