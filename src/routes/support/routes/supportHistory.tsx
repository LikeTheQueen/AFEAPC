import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { handleSendEmail } from "email/emailBasic";
import { fetchSupportHistory } from "provider/fetch";
import { createSupportTicket, createSupportTicketThread } from "provider/write";
import { useEffect, useState } from "react";
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
  }, [loggedInUser])

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

  async function handleComment(related_ticket: number) {
    await createSupportTicketThread(commentVal[related_ticket] || '', new Date(), related_ticket);
    getHistory();
    setCommentVal(prev => ({
      ...prev,
      [related_ticket]: ''
    }));
  };

  return (
    <>
      <div className="px-4 sm:px-10 sm:py-16">
        <div className="divide-y divide-[var(--darkest-teal)]/40">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-1 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
            <div className="">
              <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Oh hey there!</h2>
              <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">So glad you stopped by.  Tell us what you need help with and we'll get back to you as soon as possible. </p>

            </div>
          </div>
          <div className="px-4 py-6 sm:p-8 sm:col-span-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-2">
              <div className="sm:col-span-3">
                <NoSelectionOrEmptyArrayMessage
                  message={'There are no support tickets to view'}>
                </NoSelectionOrEmptyArrayMessage>
              </div>
              <div>
                <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 " data-testid="SupportHistory">
                  {[...rowsToShow].sort((a, b) => b.id - a.id).map((support, supportIdx) => (
                    <li key={support.id}
                      className="pb-4 col-span-1 rounded-lg bg-white shadow-2xl hover:shadow-lg hover:shadow-[#F61067] transition-shadow ease-in-out duration-500 custom-style ring-1 ring-[var(--darkest-teal)]/70 flex flex-col">


                      <div className={`rounded-t-lg text-base/7 font-medium px-2 ${!support.active ? 'bg-[var(--bright-pink)] text-white' : 'text-[var(--darkest-teal)] border-b border-[var(--darkest-teal)]'} `}>
                        {!support.active ? 'Closed' : 'Active'}
                      </div>


                      <div className={`flex w-full items-center justify-between px-3 py-1 mb-4 border-b border-[var(--darkest-teal)]/30`}>
                        <div className="text-base/7 font-medium text-[var(--darkest-teal)] ">
                          {support.subject}
                        </div>
                        <div className={`text-base/6 font-normal text-[var(--darkest-teal)]/80`}>
                          {formatDateShort(support.created_at)}
                        </div>
                      </div>


                      <div className="flex-1">
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

                        {/* Comment box */}
                        <div className="relative flex-auto">
                          <div className="mx-6 mt-4 overflow-hidden rounded-lg pb-12 outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 bg-white shadow-2xl focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
                            <label htmlFor="comment" className="sr-only">
                              Add your comment
                            </label>
                            <textarea
                              id="comment"
                              name="comment"
                              rows={2}
                              placeholder="Add your comment..."
                              className="block w-full resize-none bg-transparent px-3 py-1.5 text-sm/6 text-[var(--darkest-teal)] placeholder:text-[var(--darkest-teal)]/70 focus:outline-none custom-style"
                              value={commentVal[support.id] || ''}
                              onChange={(e) => handleCommentChange(e, support.id)}
                            />
                          </div>
                          <div className="absolute inset-x-6 bottom-0 flex justify-end py-2 pr-2 pl-3 ">
                            <button
                              disabled={!commentVal[support.id] || commentVal[support.id] === ''}
                              type="submit"
                              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2.5 py-1.5 text-sm/5 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                              onClick={e => handleComment(support.id)}>
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>


                      <div className="flex justify-end px-6 py-3 border-t border-[var(--darkest-teal)]/20">
                        <button
                          disabled={support.active === false}
                          type="button"
                          className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2.5 py-1.5 text-sm/5 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                        //onClick={e => handleCloseTicket(support.id)}>
                        >Close Ticket
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>


            </div>
            <UniversalPagination
              data={supportHistories}
              rowsPerPage={3}
              listOfType="Support Tickets"
              onPageChange={handlePageChange}
            />

          </div>

        </div>

      </div>
      <ToastContainer />
    </>
  )
}