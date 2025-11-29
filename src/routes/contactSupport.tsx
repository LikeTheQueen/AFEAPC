import { handleSendEmail } from "email/emailBasic";
import { createSupportTicket } from "provider/write";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyStandard } from "src/helpers/helpers";
import { useSupabaseData } from "src/types/SupabaseContext";

export default function ContactSupport() {
  const { loggedInUser } = useSupabaseData();
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');

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

  return (
    <>
      <div className="px-4 sm:px-10 sm:py-16">
        <div className="rounded-lg bg-white shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 p-4 mb-5">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 sm:divide-x sm:divide-[var(--darkest-teal)]/40">
            <div className="">
              <h2 className="text-base/7 font-semibold text-[var(--darkest-teal)] custom-style">Oh hey there!</h2>
              <p className="text-base/6 text-[var(--darkest-teal)] custom-style-long-text px-3">So glad you stopped by.  Tell us what you need help with and we'll get back to you as soon as possible. </p>

            </div>
            <div className="px-4 py-6 sm:p-8">
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
                      onChange={e => setEmailSubject(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[var(--darkest-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)]/40 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6 custom-style-long-text"
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
                    //handleNewUser('Rachel', 'Green', 'elizabeh.rider.shaw@gmail.com', 'topSecretPassword25!', false, roles, partnerRoles, false, token);
                  }}
                  className="rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 px-3 py-2 text-sm/6 font-semibold custom-style text-white shadow-xs hover:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] justify-end cursor-pointer disabled:cursor-not-allowed">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}