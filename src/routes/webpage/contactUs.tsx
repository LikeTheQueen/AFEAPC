import { handleSendEmail } from "email/emailBasic";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { supportEmail } from "src/constants/variables";
import { useLocation } from "react-router";

type PageConfig = {
  eyebrow: string;
  heading: string;
  subheading: string;
  cardTitle: string;
  cardSubtitle: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  footerNote: string;
};

const pageConfig: Record<string, PageConfig> = {
  "/contactus": {
    eyebrow: "Get In Touch",
    heading: "Don't be a Stranger.",
    subheading: "Have a question, idea, or something that refuses to make sense? Send it our way.",
    cardTitle: "Drop us a line",
    cardSubtitle: "We don't do ghosting —",
    subjectPlaceholder: "What's on your mind?",
    messagePlaceholder: "The floor is yours. Tell us what you're looking for...",
    submitLabel: "Send Message",
    footerNote: "We typically respond within one business day.",
  },
  "/requestdemo": {
    eyebrow: "The Grand Tour",
    heading: "See It in Action.",
    subheading: "Ready to see how AFE Partner Connections helps clean up the AFE chaos? We'll walk you through it.",
    cardTitle: "Schedule a Demo",
    cardSubtitle: "We'll reach out to lock in a time —",
    subjectPlaceholder: "Your company / organization name",
    messagePlaceholder: "Tell us about your current AFE workflow, what's broken, and what you're hoping to fix...",
    submitLabel: "Request Demo",
    footerNote: "A member of our team will be in touch within one business day.",
  },
  "/contactsupport": {
    eyebrow: "Support",
    heading: "Houston, we have a...",
    subheading: "Tell us what's going wrong and we'll help get things back on track.",
    cardTitle: "New Support Ticket",
    cardSubtitle: "Log in first and we can create Support records in the app —",
    subjectPlaceholder: "What's this about?",
    messagePlaceholder: "Describe the issue, what you expected, what actually happened, and any steps to reproduce it...  The more detail you give, the faster we can crush this bug.",
    submitLabel: "Submit Ticket",
    footerNote: "We typically respond within one business day.",
  },
};

const defaultConfig = pageConfig["/contactus"];

export default function ContactForm() {
  const { pathname } = useLocation();
  const config = pageConfig[pathname] ?? defaultConfig;
  const [emailBody, setEmailBody] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState('');
  const [personName, setPersonName] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleClickSendEmail = async () => {
    const isBot = website !== '';

      await handleSendEmail(
        `${isBot ? 'BOT ALERT' : ''}Contact Form Filled out ${config.eyebrow}`,
        `${isBot ? 'BOT ALERT' : ''} ${isBot ? website : ''} Someone wants to contact you!  Bang Biscuit!  Email from ${personName} at ${company}.  Their email is ${emailAddress}.`,
        'Queen',
        emailAddress,
        personName,
        supportEmail
      );
      setMessageSent(true);
      //setEmailBody('');
      //setEmailAddress('');
      setPersonName('');
      setCompany('');
      setWebsite('');
      
  };

  const isDisabled = emailBody === '' || !isValidEmail(emailAddress) || personName === '' || company === '';

  return (
    <>
    <div hidden={messageSent} className="min-h-screen px-4 sm:px-10 py-10 sm:py-8 bg-[var(--darkest-teal)]">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center gap-3 mb-6">
            <span className="block w-6 h-px bg-[var(--bright-pink)]" />
            <span className="custom-style text-xs sm:text-sm font-semibold tracking-[0.25em] text-[var(--bright-pink)]">
              {config.eyebrow}
            </span>
          </div>

          <h1 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight mb-3">
            {config.heading}
          </h1>
          <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/80 leading-relaxed mb-10">
            {config.subheading}
          </p>
        {/* The Email Form */}
          <div className="border border-white/[0.08] rounded-sm overflow-hidden">
            <div className="bg-[var(--dark-teal)] px-6 sm:px-8 py-6 flex items-center justify-between border-b border-white/[0.08]">
              <div>
                <div className="custom-style font-medium text-base sm:text-lg text-white mb-0.5">
                  {config.cardTitle}
                </div>
                <div className="custom-style-long-text font-light text-xs sm:text-sm text-white/70">
                  {config.cardSubtitle}
                </div>
              </div>
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-[var(--bright-pink)] rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-[var(--bright-pink)]/60 rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-[var(--bright-pink)]/30 rounded-full animate-pulse delay-200" />
              </div>
            </div>

            <div className="bg-black/20 px-6 sm:px-8 py-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
                <div >
                <label htmlFor="company" className="block custom-style font-medium text-xs sm:text-sm tracking-[0.18em] text-white/80 mb-2">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={company}
                  autoComplete="off"
                  onChange={e => setCompany(e.target.value)}
                  className="block w-full rounded-sm bg-[var(--dark-teal)]/60 border border-white/20 px-4 py-3
                    text-sm text-white placeholder:text-white/60 custom-style-long-text font-light
                    outline-none focus:border-[var(--bright-pink)]/60 focus:bg-[var(--dark-teal)]/60
                    transition-colors duration-200"
                />
                </div>
                <div className="mt-4 sm:mt-0">
                <label htmlFor="username" className="block custom-style font-medium text-xs sm:text-sm tracking-[0.18em] text-white/80 mb-2">
                  Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={personName}
                  autoComplete="off"
                  onChange={e => setPersonName(e.target.value)}
                  className="block w-full rounded-sm bg-[var(--dark-teal)]/60 border border-white/20 px-4 py-3
                    text-sm text-white placeholder:text-white/60 custom-style-long-text font-light
                    outline-none focus:border-[var(--bright-pink)]/60 focus:bg-[var(--dark-teal)]/60
                    transition-colors duration-200"
                />
                </div>
                <div className="mt-4 sm:mt-0">
                <label htmlFor="useremail" className="block custom-style font-medium text-xs sm:text-sm tracking-[0.18em] text-white/80 mb-2">
                  Email
                </label>
                <input
                  id="useremail"
                  name="useremail"
                  type="text"
                  value={emailAddress}
                  autoComplete="off"
                  onChange={e => setEmailAddress(e.target.value)}
                  className="block w-full rounded-sm bg-[var(--dark-teal)]/60 border border-white/20 px-4 py-3
                    text-sm text-white placeholder:text-white/60 custom-style-long-text font-light
                    outline-none focus:border-[var(--bright-pink)]/60 focus:bg-[var(--dark-teal)]/60
                    transition-colors duration-200"
                />
                </div>
              </div>
              <div>
                <label htmlFor="emailBody" className="block custom-style font-medium text-xs sm:text-sm tracking-[0.18em] text-white/80 mb-2">
                  Message
                </label>
                <textarea
                  id="emailBody"
                  name="emailBody"
                  value={emailBody}
                  autoComplete="off"
                  placeholder={config.messagePlaceholder}
                  onChange={e => setEmailBody(e.target.value)}
                  className="h-52 block w-full rounded-sm bg-[var(--dark-teal)]/60 border border-white/20 px-4 py-3
                    text-sm text-white placeholder:text-white/80 custom-style-subheader font-normal
                    outline-none resize-none focus:border-[var(--bright-pink)]/60 focus:bg-[var(--dark-teal)]/60
                    transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-white/50">
                <p className="custom-style-long-text font-light text-xs sm:text-sm text-white/70">
                  {config.footerNote}
                </p>
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={(e: React.MouseEvent) => { e.preventDefault(); handleClickSendEmail(); }}
                  className="custom-style font-semibold text-sm tracking-[0.15em] px-8 py-2 mt-3 sm:mt-2 rounded-sm
                    transition-all duration-200 disabled:bg-white/30 disabled:cursor-not-allowed
                    enabled:bg-white enabled:text-black
                    enabled:hover:shadow-[0_8px_24px_rgba(246,16,103,0.35)]
                    cursor-pointer"
                >
                  {config.submitLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div hidden={!messageSent} className="px-4 sm:px-10 py-10 sm:py-8 bg-[var(--darkest-teal)] flex items-center justify-center">
  <div className="max-w-4xl w-full mx-auto">

    <div className="flex items-center gap-3 mb-6">
      <span className="block w-6 h-px bg-[var(--bright-green)]" />
      <span className="custom-style text-xs sm:text-sm font-semibold tracking-[0.25em] text-[var(--bright-green)]">
        Message received. We'll take it from here
      </span>
    </div>

    <h1 className="custom-style font-semibold text-3xl sm:text-5xl text-white leading-tight mb-3">
      We'll Be in Touch.
    </h1>
    <p className="custom-style-subheader-regular-case font-light text-sm sm:text-lg text-white/70 leading-relaxed mb-10">
      Thanks for reaching out. We've got the details and will follow up within one business day.
    </p>

    <div className="border border-white/[0.08] rounded-sm overflow-hidden">
      <div className="bg-[var(--dark-teal)] px-6 sm:px-8 py-6 flex items-center gap-4 border-b border-white/[0.08]">
        <div className="w-9 h-9 rounded-sm bg-[var(--bright-green)]/15 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 stroke-[var(--bright-green)] fill-none stroke-2 stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <div className="custom-style font-semibold text-base text-white mb-0.5">Submission Received</div>
          <div className="custom-style-long-text font-light text-xs text-[var(--light-grey)]">Sent to {supportEmail}</div>
        </div>
        <div className="flex gap-1.5 items-center ml-auto">
          <div className="w-2 h-2 bg-[var(--bright-green)] rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-[var(--bright-green)]/60 rounded-full animate-pulse delay-100" />
          <div className="w-2 h-2 bg-[var(--bright-green)]/30 rounded-full animate-pulse delay-200" />
        </div>
      </div>

      <div className="bg-[var(--darkest-teal)] px-6 sm:px-8 py-8 flex flex-col gap-3">
        <div className="flex gap-4 py-3 border-b border-white/[0.06]">
          <span className="custom-style font-semibold text-xs tracking-[0.18em] text-[var(--light-grey)] w-20 flex-shrink-0">Subject</span>
          <span className="custom-style-long-text font-light text-sm text-white/70">{config.subjectPlaceholder}</span>
        </div>
        <div className="flex gap-4 py-3 border-b border-white/[0.06]">
          <span className="custom-style font-semibold text-xs tracking-[0.18em] text-[var(--light-grey)] w-20 flex-shrink-0">From</span>
          <span className="custom-style-long-text font-light text-sm text-white/70">{emailAddress}</span>
        </div>
        <div className="flex gap-4 py-3">
          <span className="custom-style font-semibold text-xs tracking-[0.18em] text-[var(--light-grey)] w-20 flex-shrink-0">Message</span>
          <span className="custom-style-long-text font-light text-sm text-white/70 leading-7">{emailBody}</span>
        </div>
      </div>
    </div>

  </div>
    </div>  
    </>
  );
}
