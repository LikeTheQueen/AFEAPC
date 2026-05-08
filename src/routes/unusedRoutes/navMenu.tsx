
import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink } from "react-router";
import { APP_LOGO } from 'src/constants/variables';
import { mainNavigation } from 'src/constants/variables';

export default function NavMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-[var(--darkest-teal)]/80 transition-opacity duration-300 ease-linear data-closed:opacity-0" />
          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full">
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[var(--darkest-teal)] px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <a href="/" className="-m-1.5 ">
                    <span className="sr-only">AFE partner Connections</span>
                    <img
                      alt=""
                      src={APP_LOGO}
                      className="h-8 w-auto"
                    />
                  </a>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    {/* AFE MENU OPTIONS*/}
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {mainNavigation.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              className={({ isActive, isPending }) =>
                                isActive
                                  ? 'bg-[var(--darkest-teal)] text-white custom-style text-sm/6 group flex gap-x-3 rounded-md p-2 hover:bg-[var(--bright-pink)]'
                                  : isPending
                                    ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold'
                                    : 'text-white font-normal text-sm/6 custom-style hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 '
                              }
                              to={item.href}
                              onClick={handleClick}>
                              <span className="">{item.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
      <div className='bg-black/20'>
        <div className="overflow-visible py-6 sm:pb-6 bg-black/20" aria-label='landingPage'>
          <nav aria-label="Global" className="grid grid-cols-6 items-center pt-2 pb-2 sm:px-0 ">
            {/* Logo - Left */}
            <div className="col-span-1 justify-start pl-4">
              <a href="/" className="">
                <span className="sr-only">AFE partner Connections</span>
                <img
                  alt=""
                  src={APP_LOGO}
                  className="h-16 sm:h-20 w-auto"
                />
              </a>
            </div>

            {/* Menu items - Center */}
            <div className='hidden sm:justify-center sm:col-span-4 sm:grid grid-cols-5 gap-x-0'>
              {mainNavigation.map((item) => (
                  <div key={item.id} className="w-9/10 mx-auto relative inline-flex items-center justify-center group">
                <NavLink
                to={item.href} 
                className={({ isActive }) => `absolute -inset-px transition-all duration-100 rounded-b-lg bg-transparent
                ${isActive
                  ? 'border-b border-b-[var(--bright-green)]'
                  : 'border-b border-b-[var(--bright-pink)] group-hover:shadow-md group-hover:shadow-[#F61067]'
                   
                }`}></NavLink>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                      `text-sm/10 relative inline-flex items-center justify-center rounded-b-lg px-6 py-1 custom-style  text-white transition-colors duration-300 w-full
                    ${isActive
                        ? 'font-semibold'
                        : 'font-light'
                      }`
                    }
                  role="button">
                  {item.name} 
                </NavLink>
              </div>
                ))}

            </div>

            {/* Login button - Right */}
            <div className="hidden sm:justify-end sm:pr-10 sm:flex sm:col-span-1 sm:col-start-6">
              <div className="relative inline-flex items-center justify-center group">
                <div className="absolute -inset-px transition-all duration-200 rounded-lg bg-gradient-to-r from-[var(--dark-teal)] to-[var(--bright-pink)] group-hover:shadow-md group-hover:shadow-[#F61067]"></div>
                <NavLink
                  to='login'
                  className="relative inline-flex items-center justify-center px-6 py-2 custom-style font-normal text-white bg-black border border-transparent rounded-lg"
                  role="button">
                  Login
                </NavLink>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="col-span-1 col-start-6 justify-end sm:hidden">
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
      </div>
    </>
  )
};


