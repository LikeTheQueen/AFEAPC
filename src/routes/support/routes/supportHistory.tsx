import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ChatBubbleLeftEllipsisIcon, ClockIcon } from "@heroicons/react/24/outline";

import { handleSendEmail } from "email/emailBasic";
import { fetchSupportHistory } from "provider/fetch";
import { createSupportTicket, createSupportTicketThread, updateSupportTicket } from "provider/write";

import { notifyStandard } from "src/helpers/helpers";
import { formatDateShort } from "src/helpers/styleHelpers";
import NoSelectionOrEmptyArrayMessage from "src/routes/sharedComponents/noSelectionOrEmptyArrayMessage";
import UniversalPagination from "src/routes/sharedComponents/pagnation";
import { type SupportHistory } from "src/types/interfaces";
import { useSupabaseData } from "src/types/SupabaseContext";
import { CheckCircle2, Clock } from "lucide-react";

export default function ContactSupport() {
  const { loggedInUser } = useSupabaseData();

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [supportHistories, setSupportHistories] = useState<SupportHistory[]>([]);
  const [rowsToShow, setRowsToShow] = useState<SupportHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [commentVal, setCommentVal] = useState<Record<number, string>>({});
  const [resolutionVal, setResolutionVal] = useState<Record<number, string>>({});

  const scrollRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const getHistory = useCallback(async () => {
    if (!loggedInUser?.user_id) return;
    const supportHistory = await fetchSupportHistory(
      loggedInUser.user_id,
      loggedInUser.is_super_user
    );
    setSupportHistories(supportHistory);
  }, [loggedInUser?.user_id, loggedInUser?.is_super_user]);

  useEffect(() => {
    if (!loggedInUser?.user_id) return;
    void getHistory();
  }, [loggedInUser?.user_id, getHistory]);

  // Scroll each visible card to bottom when page data changes
  useEffect(() => {
    rowsToShow.forEach((support) => {
      const el = scrollRefs.current[support.id];
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [rowsToShow]);

  const handlePageChange = (paginatedData: SupportHistory[], page: number) => {
    setRowsToShow(paginatedData);
    setCurrentPage(page);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    supportId: number
  ) => {
    const value = event.target.value;
    setCommentVal((prev) => ({
      ...prev,
      [supportId]: value,
    }));
  };

  const handleResolutionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    supportId: number
  ) => {
    const value = event.target.value;
    setResolutionVal((prev) => ({
      ...prev,
      [supportId]: value,
    }));
  };

  const handleClickSendEmail = async () => {
    if (!loggedInUser?.email || !loggedInUser.firstName) return;

    try {
      // Send email to support
      await handleSendEmail(
        emailSubject,
        emailBody,
        "elizabeth.shaw@afepartner.com",
        loggedInUser.email,
        loggedInUser.firstName,
        loggedInUser.email
      );

      // Confirmation email to user
      await handleSendEmail(
        "Your Support Ticket has been received",
        "We have received your support request.",
        loggedInUser.email,
        "AFE Partner Connections",
        loggedInUser.firstName,
        "AFE Partner Connections"
      );

      
      await createSupportTicket(emailSubject, emailBody);

      notifyStandard(
        "Your support ticket’s been logged and is now in the pipeline. Sit tight while we pressure test the issue and bring it up to production."
      );

      setEmailBody("");
      setEmailSubject("");
      void getHistory();
    } catch (err) {
     
      console.error("Error sending support email / creating ticket:", err);
      notifyStandard("Something went wrong submitting your support ticket.");
    }
  };

  const handleComment = async (related_ticket: number) => {
    const comment = commentVal[related_ticket] || "";
    if (!comment.trim()) return;

    await createSupportTicketThread(comment, new Date(), related_ticket);
    setCommentVal((prev) => ({
      ...prev,
      [related_ticket]: "",
    }));
    void getHistory();
  };

  const handleCloseTicket = async (id: number, active: boolean) => {
    if (!loggedInUser?.user_id) return;
    await updateSupportTicket(id, active, loggedInUser.user_id, resolutionVal[id] || "");
    void getHistory();
  };

  return (
    <>
      <div className="px-4 sm:px-10 sm:py-4">
        <div className="divide-y divide-[var(--darkest-teal)]/40">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-1 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
            <div>
              <h2 className="text-xl font-semibold text-[var(--darkest-teal)] custom-style">
                Support History
              </h2>
              <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">
                You can view all your support tickets anytime. If you need to add
                anything, just drop a comment on the ticket and we’ll see it.
                Simple, no fuss.
              </p>
            </div>
          </div>

          <div className="px-4 py-6 sm:p-8 sm:col-span-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4">
              {/* No tickets */}
              <div hidden={rowsToShow.length > 0} className="sm:col-span-3">
                <NoSelectionOrEmptyArrayMessage message="There are no support tickets to view" />
              </div>

              {/* Tickets */}
              <div hidden={rowsToShow.length === 0}>
                <ul
                  role="list"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  data-testid="SupportHistory"
                >
                  {[...rowsToShow]
                    .sort((a, b) => b.id - a.id)
                    .map((support) => (
                      <SupportTicketCard
                        key={support.id}
                        support={support}
                        loggedInUser={loggedInUser}
                        commentValue={commentVal[support.id] || ""}
                        resolutionValue={resolutionVal[support.id] || ""}
                        onCommentChange={handleCommentChange}
                        onResolutionChange={handleResolutionChange}
                        onComment={handleComment}
                        onCloseTicket={handleCloseTicket}
                        scrollRef={(el) => {
                          scrollRefs.current[support.id] = el;
                        }}
                      />
                    ))}
                </ul>
              </div>
            </div>

            <div hidden={rowsToShow.length === 0}>
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
  );
}

interface SupportTicketCardProps {
  support: SupportHistory;
  loggedInUser: ReturnType<typeof useSupabaseData>["loggedInUser"];
  commentValue: string;
  resolutionValue: string;
  onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  onResolutionChange: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  onComment: (id: number) => void;
  onCloseTicket: (id: number, active: boolean) => void;
  scrollRef: (el: HTMLDivElement | null) => void;
}

function SupportTicketCard({
  support,
  loggedInUser,
  commentValue,
  resolutionValue,
  onCommentChange,
  onResolutionChange,
  onComment,
  onCloseTicket,
  scrollRef,
}: SupportTicketCardProps) {
  const isSuperUser = !!loggedInUser?.is_super_user;

  return (
    <li className="h-[550px] lg:h-[600px] pb-4 col-span-1 rounded-lg bg-white shadow-2xl hover:shadow-lg hover:shadow-[#F61067] transition-shadow ease-in-out duration-500 ring-1 ring-[var(--darkest-teal)]/70 flex flex-col min-h-0">
      {/* Status, Subject and Date */}
      <div
        className={`rounded-t-lg text-lg/10 font-medium flex items-center gap-2 px-2 custom-style ${
          support.active
            ? "bg-gradient-to-r from-[var(--bright-pink)]/60 to-[var(--bright-pink)] text-white"
            : "bg-gradient-to-r from-[var(--darkest-teal)]/60 to-[var(--darkest-teal)] text-white"
        }`}
      >
        {support.active ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold">Active</span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-4 h-4" />
                    <span className="font-semibold">Closed</span>
                  </>
                )}
      </div>
      <div className="flex w-full items-center justify-between p-2 border-b border-[var(--darkest-teal)]/30 bg-white/50">
        <div className="basis-3/4 text-start text-sm/6 font-medium text-[var(--darkest-teal)] custom-style-long-text line-clamp-2">
          {support.subject}
        </div>
        <div className="basis-1/4 text-end text-sm/6 font-normal text-[var(--darkest-teal)]/80 custom-style-long-text line-clamp-1">
          {formatDateShort(support.created_at)}
        </div>
      </div>

      {/* History + comment input */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Scrollable history */}
        <div className="flex-1 overflow-y-auto px-2" ref={scrollRef}>
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
              <div className="custom-style-long-text text-[var(--dark-teal)] text-sm/5 ">
                {support.message}
              </div>
            </div>
          </div>

          {/* Thread messages */}
          {support.support_thread.length > 0 && (
            <div className="pt-4">
              {[...support.support_thread]
                .sort((a, b) => a.id - b.id)
                .map((thread, threadIdx) => (
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
                        <ChatBubbleLeftEllipsisIcon
                          aria-hidden="true"
                          className="size-5 text-gray-400"
                        />
                      </span>
                    </div>
                    <div className="flex-1 p-1">
                      <div className="flex items-center justify-between custom-style font-normal text-[var(--dark-teal)] text-sm/5 mb-1">
                        <div className="custom-style font-medium text-[var(--darkest-teal)] text-sm/5">
                          {thread.created_by}
                        </div>
                        <div className="custom-style font-normal text-[var(--darkest-teal)] text-xs/5 pr-2 sm:pr-4">
                          {formatDateShort(thread.created_at)}
                        </div>
                      </div>
                      <div className="custom-style-long-text text-[var(--dark-teal)] text-sm/5 bg-[var(--darkest-teal)]/10 rounded-lg p-3">
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
            value={commentValue}
            onChange={(e) => onCommentChange(e, support.id)}
          />
          <div className="flex justify-end border-t border-[var(--darkest-teal)]/20 px-3 py-2">
            <button
              disabled={!commentValue || commentValue.trim() === ""}
              type="button"
              className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2.5 py-1.5 text-sm/5 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
              onClick={() => onComment(support.id)}
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Resolution + close ticket (super user only) */}
      {isSuperUser && (
        <div className="min-h-12 flex-col justify-items-end mx-3 mt-3 pt-3 border-t border-[var(--darkest-teal)]/40">
          <div hidden={!support.active} className="w-full rounded-lg outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 bg-white shadow-2xl focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--bright-pink)]">
            <label htmlFor={`resolution-${support.id}`} className="sr-only">
              Resolution
            </label>
            <textarea
              id={`resolution-${support.id}`}
              name="resolution"
              rows={2}
              placeholder="What is the resolution..."
              className="min-h-10 block w-full resize-none bg-transparent px-2.5 py-1.5 text-sm/5 text-[var(--darkest-teal)] placeholder:text-[var(--darkest-teal)]/70 focus:outline-none custom-style"
              value={resolutionValue}
              onChange={(e) => onResolutionChange(e, support.id)}
            />
            <div className="flex justify-end border-t border-[var(--darkest-teal)]/20 px-3 py-2">
              <button
                hidden={!support.active}
                disabled={!support.active}
                type="button"
                className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2.5 py-1.5 text-sm/5 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]"
                onClick={() => onCloseTicket(support.id, !support.active)}
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution display when closed */}
      {!support.active && (
        <>
          <div
            className={`${isSuperUser ? "-mt-12" : ""} flex w-full items-start justify-between px-3 py-1`}
          >
            <div className="text-base/6 font-medium text-[var(--darkest-teal)]">
              Resolution
            </div>
            <div className="text-sm/6 font-normal text-[var(--darkest-teal)]/80 custom-style-long-text">
              {support.resolution_date && formatDateShort(support.resolution_date)}
            </div>
          </div>
          <div className="px-2 py-1 text-base/6 font-normal text-[var(--dark-teal)] custom-style-long-text">
            {support.resolution}
          </div>
        </>
      )}
    </li>
  );
}
