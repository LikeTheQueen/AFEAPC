
'use client'
import supabase from "provider/supabase";
import { useState, useEffect } from 'react';
import { Outlet } from "react-router";
import { NavLink } from "react-router";
import "../style.css";
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
import {
  Bars3Icon,
  BellIcon,
  ClockIcon,
  Cog6ToothIcon,
  FolderIcon,
  XMarkIcon,
  PhoneArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useSupabaseData } from "../types/SupabaseContext";
import { DialogTitle } from '@headlessui/react'




const navigation = [
  { name: 'AFEs', href: "/mainScreen/afe", icon: FolderIcon},
  { name: 'Historical AFEs', href: "/mainscreen/afeArchived", icon: ClockIcon },
  { name: 'Notifications', href: "/mainScreen/notifications", icon: BellIcon },
  { name: 'Support History', href: "/mainScreen/supporthistory", icon: PhoneArrowUpRightIcon },
  
]
const help = [
  { id: 1, name: 'Missing an Operated AFE?', href: "missingAFEsupport", initial: 'M' },
  { id: 2, name: 'Contact Support', href: "contactsupport", initial: 'C' }
]
const settings = [
  { id: 1, name: 'Manage Permissions', href: "/mainscreen/managePermissions", initial: 'P' },
  { id: 2, name: 'Manage Users', href: "/mainscreen/manageUsers", initial: 'U' },
  { id: 3, name: 'Manage Operator Addresses', href: "/mainScreen/editOperator", initial: 'O' },
  { id: 4, name: 'Configurations', href: "/mainScreen/configurations", initial: 'C' }
]
const onboarding = [
  { id: 1, name: 'Create Operator', href: "/mainscreen/createOperator", initial: 'O' },
  { id: 2, name: 'Create Users', href: "/mainscreen/createUser", initial: 'U' }
]
const userNavigation = [
  { name: 'Your profile', href: '/mainScreen/profile' },
  { name: 'Sign out' },
]


export default function MainScreen() {
  const { loggedInUser } = useSupabaseData();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      location.href = '/'
    } catch (error: unknown) {
      setError(error instanceof Error ? error.name : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    setSidebarOpen(false);
  }

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-[var(--darkest-teal)]/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"/>
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
                  <img
                    alt="AFE Partner Connections"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              className={({ isActive, isPending }) =>
                                isActive
                                  ? 'bg-[var(--dark-teal)] text-white custom-style text-sm/6 group flex gap-x-3 rounded-md p-2 hover:bg-[var(--bright-pink)]'
                                  : isPending
                                    ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold'
                                    : 'text-white font-normal text-sm/6 custom-style hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 '
                              }
                              to={item.href}
                              onClick={handleClick}
                            >
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                                <item.icon aria-hidden="true" className="size-3.5 shrink-0 " />
                              </span>
                              <span className="">{item.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-[var(--darkest-teal)] px-3 custom-style text-s/6 text-white">System</span>
                        </div>
                      </div>

                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {settings.map((setting) => (
                          <li key={setting.name}>
                            <NavLink
                              className={({ isActive, isPending }) =>
                                isActive
                                  ? 'bg-[var(--dark-teal)] text-white text-sm/6 custom-style group flex gap-x-3 rounded-md p-2  hover:bg-[var(--bright-pink)]'
                                  : isPending
                                    ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold'
                                    : 'text-white font-normal text-sm/6 custom-style hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 items-center'
                              }
                              to={setting.href}
                              onClick={handleClick}
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                                {setting.initial}
                              </span>
                              <span className="truncate">{setting.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-[var(--darkest-teal)] px-3 custom-style text-s/6 text-white">Help</span>
                        </div>
                      </div>

                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {help.map((help) => (
                          <li key={help.name}>
                            <NavLink
                              className={({ isActive, isPending }) =>
                                isActive
                                  ? 'bg-[var(--dark-teal)] text-white text-sm/6 custom-style group flex gap-x-3 rounded-md p-2  hover:bg-[var(--bright-pink)]'
                                  : isPending
                                    ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold'
                                    : 'text-white font-normal text-sm/6 custom-style hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 items-center'
                              }
                              to={help.href}
                              onClick={handleClick}
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                                {help.initial}
                              </span>
                              <span className="truncate">{help.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="relative">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-[var(--darkest-teal)] px-3 custom-style text-s/6 text-white">Onboarding</span>
                        </div>
                      </div>

                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {onboarding.map((onboarding) => (
                          <li key={onboarding.name}>
                            <NavLink
                              className={({ isActive, isPending }) =>
                                isActive
                                  ? 'bg-[var(--dark-teal)] text-white text-sm/6 custom-style group flex gap-x-3 rounded-md p-2  hover:bg-[var(--bright-pink)]'
                                  : isPending
                                    ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold'
                                    : 'text-white font-normal text-sm/6 custom-style hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 items-center'
                              }
                              to={onboarding.href}
                              onClick={handleClick}
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                                {onboarding.initial}
                              </span>
                              <span className="truncate">{onboarding.name}</span>
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

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[var(--darkest-teal)] px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="AFE Partner Connections"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          className={({ isActive, isPending }) =>
                            isActive
                              ? 'bg-[var(--bright-pink)] text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold custom-style hover:bg-[var(--bright-pink)] items-center'
                              : isPending
                                ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold items-center'
                                : 'text-white font-normal text-m/6 custom-style transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 items-center'
                          }
                          to={item.href}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                            <item.icon aria-hidden="true" className="size-4 shrink-0 " />
                          </span>
                          <span className="">{item.name}</span>

                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="relative">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[var(--darkest-teal)] px-3 custom-style text-white">System</span>
                    </div>
                  </div>

                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {settings.map((setting) => (
                      <li key={setting.name}>
                        <NavLink
                          className={({ isActive, isPending }) =>
                            isActive
                              ? 'bg-[var(--bright-pink)] text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold custom-style hover:bg-[var(--bright-pink)] items-center'
                              : isPending
                                ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold items-center'
                                : 'text-white font-normal text-m/6 custom-style transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 items-center'
                          }
                          to={setting.href}>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                            {setting.initial}
                          </span>
                          <span className="">{setting.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="relative">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[var(--darkest-teal)] px-3 custom-style text-white">Help</span>
                    </div>
                  </div>

                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {help.map((help) => (
                      <li key={help.name}>
                        <NavLink
                          className={({ isActive, isPending }) =>
                            isActive
                              ? 'bg-[var(--bright-pink)] text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold custom-style hover:bg-[var(--bright-pink)] items-center'
                              : isPending
                                ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold items-center'
                                : 'text-white font-normal text-m/6 custom-style transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 items-center'
                          }
                          to={help.href}>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                            {help.initial}
                          </span>
                          <span className="">{help.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="relative">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[var(--darkest-teal)] px-3 custom-style text-white">Onboarding</span>
                    </div>
                  </div>

                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {onboarding.map((onboarding) => (
                      <li key={onboarding.name}>
                        <NavLink
                          className={({ isActive, isPending }) =>
                            isActive
                              ? 'bg-[var(--bright-pink)] text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold custom-style hover:bg-[var(--bright-pink)] items-center'
                              : isPending
                                ? 'text-gray-800 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 text-m/6 font-semibold items-center'
                                : 'text-white font-normal text-m/6 custom-style transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:text-white hover:font-semibold group flex gap-x-3 rounded-md p-2 items-center'
                          }
                          to={onboarding.href}>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--dark-teal)] bg-[var(--darkest-teal)] text-[0.625rem] font-medium text-white group-hover:text-white">
                            {onboarding.initial}
                          </span>
                          <span className="">{onboarding.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>

              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-[var(--darkest-teal)] px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6 text-white" />
            </button>

            {/* Separator */}
            <div aria-hidden="true" className="h-6 w-px lg:hidden" />

            <div className="flex flex-1 gap-x-4 justify-end self-stretch lg:gap-x-6">
              
              <div className="flex items-center gap-x-4 lg:gap-x-6 bg-[var(--darkest-teal)]">
                <button type="button" className="-m-2.5 p-2.5 text-white hover:text-[var(--bright-pink)]">
                  <span className="sr-only">View notifications</span>
                  <NavLink to="/mainscreen/notifications"><BellIcon aria-hidden="true" className="size-6" /></NavLink>
                </button>

                {/* Separator */}
                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative custom-style">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full bg-gray-50"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-white">
                        {loggedInUser?.firstName + ' ' + loggedInUser?.lastName}
                      </span>
                      <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name} >
                        {
                          item.href ? (
                            <NavLink
                              to={item.href}
                              state={{ userProfile: loggedInUser }}
                              className="w-full block px-3 py-1 text-sm/6 text-[var(--darkest-teal)] hover:bg-[var(--bright-pink)] hover:text-white hover: rounded-md">
                              {item.name}
                            </NavLink>

                          ) : (
                            <button

                              onClick={handleLogout}
                              className="w-full block px-3 py-1 text-sm/6 text-[var(--darkest-teal)] hover:bg-[var(--bright-pink)] hover:text-white hover: rounded-md">

                              {item.name}
                            </button>
                          )
                        }

                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main>
            <div ><Outlet /></div>
          </main>
        </div>
        
      </div>
    </>
  )
}
