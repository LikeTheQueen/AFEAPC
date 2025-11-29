import { handleSendEmail } from "email/emailBasic";
import { createSupportTicket } from "provider/write";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyStandard } from "src/helpers/helpers";
import { useSupabaseData } from "src/types/SupabaseContext";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

export default function ContactSupport() {
  const { loggedInUser } = useSupabaseData();
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [focused, setFocused] = useState('');

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
      createSupportTicket(emailSubject,emailBody);
      setEmailBody('');
      setEmailSubject('');
    };

  };
//className="relative max-w-5xl mx-auto"
  return (
    <>
      <div className="min-h-screen px-4 sm:px-10 sm:py-16 bg-gradient-to-br from-[var(--darkest-teal)] via-[var(--darkest-teal)] to-[var(--dark-teal)] to-[var(--darkest-teal)]/60">
        <div className="max-w-5xl mx-auto">
        <div className="backdrop-blur-2xl rounded-lg shadow-2xl ring-1 ring-white mb-5">
          <div className="grid grid-cols-1 gap-x-0 sm:grid-cols-2 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
            <div className="rounded-tl-lg rounded-bl-lg bg-transparent p-8 md:p-10 text-white relative overflow-hidden">
              <div className="inline-block mb-4">
                  <div className="w-16 h-16 bg-[var(--bright-pink)] rounded-2xl flex items-center justify-center transition-transform hover:rotate-0 duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <AtSymbolIcon></AtSymbolIcon>
                    </svg>
                  </div>
                </div>
              <h2 className="text-3xl font-semibold text-white custom-style">Oh hey there!</h2>
              <p className="mt-2 text-lg text-white custom-style-long-text px-3">So glad you stopped by.  Tell us what you need help with and we'll get back to you as soon as possible. </p>
              <div className="mt-8 flex gap-2">
                  <div className="w-2 h-2 bg-[var(--bright-pink)] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse delay-200"></div>
                </div>
            </div>
            <div className="bg-white rounded-tr-lg rounded-br-lg px-4 py-6 sm:p-8">
              <div className="grid max-w-7xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-1">
                <div className="sm:col-span-4">
                  <label htmlFor="subject" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                    Subject
                  </label>
                  <div className="mt-2">
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={emailSubject}
                      autoComplete="off"
                      placeholder="What's the about?"
                      onChange={e => setEmailSubject(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/60 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label htmlFor="emailBody" className="block text-sm/6 font-medium text-[var(--darkest-teal)] custom-style">
                    Message
                  </label>
                  <div className="mt-2 ">
                    <textarea
                      id="emailBody"
                      name="emailBody"
                      value={emailBody}
                      autoComplete="off"
                      placeholder="Spill the tea and tell us what's on your mind..."
                      onChange={e => setEmailBody(e.target.value)}
                      className="h-60 block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
                    />

                  </div>
                </div>


              </div>

              <div className="flex justify-end mt-4">
                <button type="button"
                  disabled={emailBody === '' || emailSubject === ''}
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleClickSendEmail();
                  }}
                  className="rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 px-3 py-2 text-sm/6 font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end cursor-pointer disabled:cursor-not-allowed">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}