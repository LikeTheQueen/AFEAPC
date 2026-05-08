import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink } from "react-router";
import { APP_LOGO } from 'src/constants/variables';
import { mainNavigation } from 'src/constants/variables';

export default function NavHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleClick = () => setSidebarOpen(false);

  return (
    <>
      {/* ── MOBILE DRAWER ── */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-[var(--darkest-teal)]/80 backdrop-blur-sm transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/30 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <a href="/">
                  <span className="sr-only">AFE Partner Connections</span>
                  <img alt="" src={APP_LOGO} className="h-8 w-auto" />
                </a>
              </div>

              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-1">
                  {mainNavigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        onClick={handleClick}
                        className={({ isActive, isPending }) =>
                          `custom-style text-sm font-semibold flex gap-x-3 rounded-sm px-3 py-2.5 transition-all duration-200
                          ${isActive
                            ? 'bg-[var(--bright-pink)] text-white'
                            : isPending
                              ? 'text-white/50'
                              : 'text-white/70 hover:bg-[var(--dark-teal)] hover:text-white'
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 border-t border-white/[0.08]">
                  <div className="relative inline-flex items-center justify-center group">
              <div className="absolute -inset-px transition-all duration-200 rounded-sm bg-gradient-to-r from-[var(--dark-teal)] to-[var(--bright-pink)] group-hover:shadow-md group-hover:shadow-[var(--bright-pink)]/40" />
              <NavLink
                to="login"
                className="relative inline-flex items-center justify-center px-12 py-3 custom-style font-semibold text-sm text-white bg-black rounded-sm"
                onClick={handleClick}
                role="button">
                Login
              </NavLink>
            </div>
                </div>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ── DESKTOP NAV ── */}
      <div className="bg-black/40 border-b border-white/[0.06]">
        <nav aria-label="Global" className="grid grid-cols-5 items-center py-3 sm:px-0">

          <div className="col-span-1 pl-4">
            <a href="/">
              <span className="sr-only">AFE Partner Connections</span>
              <img alt="" src={APP_LOGO} className="h-16 sm:h-20 w-auto" />
            </a>
          </div>

          <div className="hidden sm:col-span-3 sm:grid grid-cols-5 gap-x-0 sm:justify-center">
            {mainNavigation.map((item) => (
              <div key={item.id} className="w-9/10 mx-auto relative inline-flex items-center justify-center group">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `absolute bottom-0 left-[25%] right-[25%] transition-all duration-200
                    ${isActive
                      ? 'border-b-2 border-b-[var(--bright-pink)] shadow-[0_4px_12px_rgba(246,16,103,0.25)]'
                      : 'border-b border-b-[var(--bright-green)]/40 group-hover:border-b-[var(--bright-green)] group-hover:border-b-2 group-hover:shadow-[0_4px_12px_rgba(246,16,103,0.15)]'
                    }`
                  }
                />
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `relative inline-flex items-center justify-center rounded-b-sm px-6 py-2 custom-style text-sm w-full transition-all duration-200
                    ${isActive
                      ? 'font-semibold text-white'
                      : 'font-light text-white/90 group-hover:text-white'
                    }`
                  }
                  role="button"
                >
                  {item.name}
                </NavLink>
              </div>
            ))}
          </div>

          <div className="hidden sm:flex sm:col-span-1 sm:col-start-5 sm:justify-end sm:pr-10">
            <div className="relative inline-flex items-center justify-center group">
              <div className="absolute -inset-px transition-all duration-200 rounded-sm bg-gradient-to-r from-[var(--dark-teal)] to-[var(--bright-pink)] group-hover:shadow-md group-hover:shadow-[var(--bright-pink)]/40" />
              <NavLink
                to="login"
                className="relative inline-flex items-center justify-center px-12 py-3 custom-style font-semibold text-sm text-white bg-black rounded-sm"
                role="button">
                Login
              </NavLink>
            </div>
          </div>

          <div className="col-span-1 col-start-6 flex justify-end pr-4 sm:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-8" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}