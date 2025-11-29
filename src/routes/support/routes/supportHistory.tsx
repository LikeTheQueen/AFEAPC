import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { handleSendEmail } from "email/emailBasic";
import { fetchSupportHistory } from "provider/fetch";
import { createSupportTicket, createSupportTicketThread, updateSupportTicket } from "provider/write";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ToastContainer } from "react-toastify";
import { notifyStandard } from "src/helpers/helpers";
import { formatDate, formatDateShort } from "src/helpers/styleHelpers";
import { noAFEsToView } from "src/routes/afeDashboard/routes/helpers/styleHelpers";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";
import UniversalPagination from "src/routes/sharedComponents/pagnation";
import { type SupportHistory, type SupportHistoryThread } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";

export default function ContactSupport() {
  const { loggedInUser } = useSupabaseData();
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [supportHistories, setSupportHistories] = useState<SupportHistory[] | []>([]);

  const [commentVal, setCommentVal] = useState<{ [key: number]: string }>({});
  const [resolutionVal, setResolutionVal] = useState<{ [key: number]: string }>({});
  const scrollRefs = useRef<Record<number, HTMLDivElement | null>>({});


  const [rowsToShow, setRowsToShow] = useState<SupportHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  async function getHistory() {
    if (!loggedInUser?.user_id) return;
    const supportHistory = await fetchSupportHistory(loggedInUser?.user_id);
    setSupportHistories(supportHistory);
  };

  useEffect(() => {
    if (!loggedInUser?.user_id) return;
    getHistory();
  }, [loggedInUser]);

  useEffect(() => {
    rowsToShow.forEach(support => {
      const el = scrollRefs.current[support.id];
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [rowsToShow]);


  const handleClickSendEmail = async () => {

    //Send email to AFE Partner Connections Support
    handleSendEmail(
      emailSubject,
      emailBody,
      'elizabeth.shaw@afepartner.com',
      loggedInUser?.email!,
      loggedInUser?.firstName!,
      loggedInUser?.email!
    ).then//Send confirmation email to user  
    handleSendEmail(
      'Your Support Ticket has been received',
      'We have received your support request.',
      loggedInUser?.email!,
      "AFE Partner Connections",
      loggedInUser?.firstName!,
      "AFE Partner Connections",
    ).then
    notifyStandard('Your support ticket’s been logged and is now in the pipeline.  Sit tight while we pressure test the issue and bring it up to production.')
    {
      createSupportTicket(emailSubject, emailBody);
      setEmailBody('');
      setEmailSubject('');
    };

  };

  const handlePageChange = (paginatedData: SupportHistory[], page: number) => {
    setRowsToShow(paginatedData);
    setCurrentPage(page);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>, supportId: number) => {
    setCommentVal(prev => ({
      ...prev,
      [supportId]: event.target.value
    }));
  };

  const handleResolutionChange = (event: React.ChangeEvent<HTMLTextAreaElement>, supportId: number) => {
    setResolutionVal(prev => ({
      ...prev,
      [supportId]: event.target.value
    }));
  };

  async function handleComment(related_ticket: number) {
    await createSupportTicketThread(commentVal[related_ticket] || '', new Date(), related_ticket);
    getHistory();
    setCommentVal(prev => ({
      ...prev,
      [related_ticket]: ''
    }));
  };

  function handleCloseTicket(id: number, active: boolean): void {
    updateSupportTicket(id, active, loggedInUser?.user_id!, resolutionVal[id] || '');
    getHistory();
  }

  return (
    <>
      <div className="px-4 sm:px-10 sm:py-4">
        <div className="divide-y divide-[var(--darkest-teal)]/40">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-1 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
            <div className="">
              <h2 className="text-xl font-semibold text-[var(--darkest-teal)] custom-style">Support History</h2>
              <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">You can view all your support tickets anytime. If you need to add anything, just drop a comment on the ticket and we’ll see it. Simple, no fuss.</p>

            </div>
          </div>
          <div className="px-4 py-6 sm:p-8 sm:col-span-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-">
              {/* Show no tickets when the support ticket length is 0 */}
              <div
                hidden={rowsToShow.length > 0 ? true : false}
                className="sm:col-span-3">
                <NoSelectionOrEmptyArrayMessage
                  message={'There are no support tickets to view'}>
                </NoSelectionOrEmptyArrayMessage>
              </div>
              {/* Hide the div if there are no support ticket*/}
              <div hidden={rowsToShow.length > 0 ? false : true} >
                <ul role="list" className="mt-0 grid grid-cols-1 gap-6 sm:grid-cols-3 " data-testid="SupportHistory">
                  {[...rowsToShow].sort((a, b) => b.id - a.id).map((support, supportIdx) => (
                    <li key={support.id}
                      className="max-h-120 sm:max-h-150 pb-4 col-span-1 rounded-lg bg-white shadow-2xl hover:shadow-lg hover:shadow-[#F61067] transition-shadow ease-in-out duration-500 ring-1 ring-[var(--darkest-teal)]/70 flex flex-col">
                      {/* Card Header shows status, subject and date */}
                      <div className={`rounded-t-lg text-lg/10 font-medium px-2 custom-style ${!support.active ? 'bg-[var(--bright-pink)] text-white' : 'text-[var(--darkest-teal)] border-b border-[var(--darkest-teal)]'} `}>
                        {!support.active ? 'Closed' : 'Active'}
                      </div>
                      <div className={`flex w-full items-center justify-between px-3 py-1 mb-4 border-b border-[var(--darkest-teal)]/30`}>
                        <div className="text-sm/10 font-medium text-[var(--darkest-teal)] custom-style-long-text">
                          {support.subject}
                        </div>
                        <div className="text-sm/6 font-normal text-[var(--darkest-teal)]/80 custom-style-long-text">
                          {formatDateShort(support.created_at)}
                        </div>
                      </div>
                      {/* Create Scroll for all message history */}
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto"
                          ref={(el) => {
                            scrollRefs.current[support.id] = el;
                          }}
                        >
                          {/* Original message */}
                          <div className="relative flex items-start space-x-3">
                            <span
                              aria-hidden="true"
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-[var(--darkest-teal)]/30"
                            />
                            <div className="relative p-2 pt-1">
                              <img
                                alt=""
                                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${support.user_id}`}
                                className="size-8 rounded-full bg-[var(--darkest-teal)]"
                              />
                              <span className="absolute -right-1 -bottom-0.5 rounded-tl bg-white px-0.5 py-px dark:bg-gray-900">
                                <ChatBubbleLeftEllipsisIcon aria-hidden="true" className="size-5 text-gray-400" />
                              </span>
                            </div>
                            <div className="p-1">
                              <div className="custom-style font-medium text-[var(--darkest-teal)] text-sm/5">
                                {support.created_by}
                              </div>
                              <div className="custom-style-long-text text-[var(--dark-teal)] text-sm/5">
                                {support.message}
                              </div>
                            </div>
                          </div>

                          {/* Thread messages */}
                          {support.support_thread.length > 0 && (
                            <div className="pt-6">
                              {[...support.support_thread].sort((a, b) => a.id - b.id).map((thread, threadIdx) => (
                                <div key={thread.id} className="relative flex items-start space-x-3 space-y-3">
                                  {threadIdx !== support.support_thread.length - 1 ? (
                                    <span
                                      aria-hidden="true"
                                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-white/10"
                                    />
                                  ) : null}
                                  <div className="relative flex-shrink-0 p-2 pt-1">
                                    <img
                                      alt=""
                                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${thread.user_id}`}
                                      className="size-8 rounded-full bg-[var(--darkest-teal)]"
                                    />
                                    <span className="absolute -right-1 -bottom-0.5 rounded-tl bg-white px-0.5 py-px dark:bg-gray-900">
                                      <ChatBubbleLeftEllipsisIcon aria-hidden="true" className="size-5 text-gray-400" />
                                    </span>
                                  </div>
                                  <div className="flex-1 p-1">
                                    <div className="flex items-center justify-between custom-style font-normal text-[var(--dark-teal)] text-sm/5">
                                      <div className="custom-style font-medium text-[var(--darkest-teal)] text-sm/5">
                                        {thread.created_by}
                                      </div>
                                      <div className="custom-style font-normal text-[var(--darkest-teal)] text-xs/5 pr-2 sm:pr-4">{formatDateShort(thread.created_at)}</div>
                                    </div>
                                    <div className="custom-style-long-text text-[var(--dark-teal)] text-sm/5 ">
                                      {thread.comment}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Comment box */}
                        <div className="mt-4 mx-3 rounded-lg outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 bg-white shadow-2xl focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                          <label htmlFor={`comment-${support.id}`} className="sr-only">
                            Add your comment
                          </label>
                          <textarea
                            id={`comment-${support.id}`}
                            name="comment"
                            rows={2}
                            placeholder="Add your comment..."
                            className="min-h-10 block w-full resize-none bg-transparent px-3 py-1.5 text-sm/6 text-[var(--darkest-teal)] placeholder:text-[var(--darkest-teal)]/70 focus:outline-none custom-style"
                            value={commentVal[support.id] || ''}
                            onChange={(e) => handleCommentChange(e, support.id)}
                          />
                          <div className="flex justify-end border-t border-[var(--darkest-teal)]/20 px-3 py-2">
                            <button
                              disabled={!commentVal[support.id] || commentVal[support.id] === ''}
                              type="button"
                              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2.5 py-1.5 text-sm/5 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                              onClick={() => handleComment(support.id)}
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Close ticket is only visible to Super User */}
                      <div hidden={loggedInUser?.is_super_user? false : true} 
                      className="min-h-12 flex-col justify-items-end mx-2 mt-3 pt-3 border-t border-[var(--darkest-teal)]/40">
                        <div 
                        hidden={!support.active}
                        className="w-full rounded-lg outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 bg-white shadow-2xl focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                          <label htmlFor={`comment-${support.id}`} className="sr-only">
                            Resolution
                          </label>
                          <textarea
                            id={`resolution-${support.id}`}
                            name="resolution"
                            rows={2}
                            placeholder="What is the resolution..."
                            className="min-h-10 block w-full resize-none bg-transparent px-3 py-1.5 text-sm/6 text-[var(--darkest-teal)] placeholder:text-[var(--darkest-teal)]/70 focus:outline-none custom-style"
                            value={resolutionVal[support.id] || ''}
                            onChange={(e) => handleResolutionChange(e, support.id)}
                          />
                          <div className="flex justify-end border-t border-[var(--darkest-teal)]/20 px-3 py-2">
                            <button
                          hidden={!support.active} 
                          disabled={support.active === false}
                          type="button"
                          className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2.5 py-1.5 text-sm/5 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                          onClick={e => handleCloseTicket(support.id, !support.active)}>
                        Close Ticket
                        </button>
                          </div>
                        </div>
                      </div>
                      <div 
                      hidden={support.active} 
                      className={`${loggedInUser?.is_super_user ? '-mt-12' : ''} flex w-full items-start justify-between px-3 py-1`}>
                        <div className="text-base/6 font-medium text-[var(--darkest-teal)] ">
                          Resolution
                        </div>
                        <div className={`text-sm/6 font-normal text-[var(--darkest-teal)]/80 custom-style-long-text`}>
                          {formatDateShort(support.resolution_date)}
                        </div>
                      </div>
                      <div className="px-2 py-1 text-base/6 font-normal text-[var(--dark-teal)] custom-style-long-text">
                          {support.resolution}
                        </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div hidden={rowsToShow.length > 0 ? false : true}>
              <UniversalPagination
                data={supportHistories}
                rowsPerPage={3}
                listOfType="Support Tickets"
                onPageChange={handlePageChange}
              />
            </div>
          </div>

        </div>

      </div>
      <ToastContainer />
    </>
  )
}