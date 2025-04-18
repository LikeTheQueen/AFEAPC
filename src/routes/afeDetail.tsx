'use client'
import { useLocation } from 'react-router';
import { useState } from 'react';
import type { AFEType } from "../types/index";
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'AFE Details', href: '#', icon: FolderIcon, current: false },
  { name: 'Estimates', href: '#', icon: ServerIcon, current: true },
  { name: 'Approvals', href: '#', icon: SignalIcon, current: false },
  { name: 'Attachments', href: '#', icon: GlobeAltIcon, current: false },
]
const teams = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
  { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
]
const secondaryNavigation = [
  { name: 'AFE Details', href: '#', current: true },
  { name: 'Estimates', href: '#', current: false },
  { name: 'Approvals', href: '#', current: false },
  { name: 'Attachments', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
]
const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' },
]
const statuses = { Completed: 'text-green-400 bg-green-400/10', Error: 'text-rose-400 bg-rose-400/10' }
const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  // More items...
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function AFEDetail() {
  const location = useLocation();
  const [selectedAFE, setSelectedAFE] = useState<AFEType>(location.state?.selectedAFE);
  console.log(location.state?.selectedAFE);
  

  return (
    <>
    <div>
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <main>
            
              {/* Secondary navigation */}
              <nav className="flex overflow-x-auto border-b border-white/10 py-4 bg-[var(--darkest-teal)]">
                <ul
                  role="list"
                  className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-white sm:px-6 lg:px-8 custom-style"
                >
                  {secondaryNavigation.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={item.current ? 'text-[var(--bright-pink)]' : ''}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Heading */}
              <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-[var(--darkest-teal)] px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div>
                  <div className="flex items-center gap-x-3">
                    
                    <h1 className="flex gap-x-3 text-base/7">
                      <span className="font-semibold text-white custom-style">AFE Number:</span>
                      <span className="font-normal text-white custom-style-long-text">{selectedAFE?.afe_number}</span>
                      
                    </h1>
                    <h1 className="flex gap-x-3 text-base/7">
                      <span className="font-semibold text-white custom-style">AFE Number:</span>
                      <span className="font-normal text-white custom-style-long-text">{selectedAFE?.afe_number}</span>
                      
                    </h1>
                  </div>
                  <p className="mt-2 text-xs/6 text-gray-400">Deploys from GitHub via main branch</p>
                </div>
                <div className="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-indigo-400/30 ring-inset sm:order-none">
                  Production
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, statIdx) => (
                  <div
                    key={stat.name}
                    className={classNames(
                      statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                      'border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8',
                    )}
                  >
                    <p className="text-sm/6 font-medium text-gray-400">{stat.name}</p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
                      {stat.unit ? <span className="text-sm text-gray-400">{stat.unit}</span> : null}
                    </p>
                  </div>
                ))}
              </div>
            

            {/* Activity list */}
            <div className="border-t border-white/10 pt-11">
              <h2 className="px-4 text-base/7 font-semibold text-white sm:px-6 lg:px-8">Latest activity</h2>
              <table className="mt-6 w-full text-left whitespace-nowrap">
                <colgroup>
                  <col className="w-full sm:w-4/12" />
                  <col className="lg:w-4/12" />
                  <col className="lg:w-2/12" />
                  <col className="lg:w-1/12" />
                  <col className="lg:w-1/12" />
                </colgroup>
                <thead className="border-b border-white/10 text-sm/6 text-white">
                  <tr>
                    <th scope="col" className="py-2 pr-8 pl-4 font-semibold sm:pl-6 lg:pl-8">
                      User
                    </th>
                    <th scope="col" className="hidden py-2 pr-8 pl-0 font-semibold sm:table-cell">
                      Commit
                    </th>
                    <th scope="col" className="py-2 pr-4 pl-0 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                      Status
                    </th>
                    <th scope="col" className="hidden py-2 pr-8 pl-0 font-semibold md:table-cell lg:pr-20">
                      Duration
                    </th>
                    <th
                      scope="col"
                      className="hidden py-2 pr-4 pl-0 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                    >
                      Deployed at
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activityItems.map((item) => (
                    <tr key={item.commit}>
                      <td className="py-4 pr-8 pl-4 sm:pl-6 lg:pl-8">
                        <div className="flex items-center gap-x-4">
                          <img alt="" src={item.user.imageUrl} className="size-8 rounded-full bg-gray-800" />
                          <div className="truncate text-sm/6 font-medium text-white">{item.user.name}</div>
                        </div>
                      </td>
                      <td className="hidden py-4 pr-4 pl-0 sm:table-cell sm:pr-8">
                        <div className="flex gap-x-3">
                          <div className="font-mono text-sm/6 text-gray-400">{item.commit}</div>
                          <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-gray-400/20 ring-inset">
                            {item.branch}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 pl-0 text-sm/6 sm:pr-8 lg:pr-20">
                        <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                          <time dateTime={item.dateTime} className="text-gray-400 sm:hidden">
                            {item.date}
                          </time>
                          
                          <div className="hidden text-white sm:block">{item.status}</div>
                        </div>
                      </td>
                      <td className="hidden py-4 pr-8 pl-0 text-sm/6 text-gray-400 md:table-cell lg:pr-20">
                        {item.duration}
                      </td>
                      <td className="hidden py-4 pr-4 pl-0 text-right text-sm/6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                        <time dateTime={item.dateTime}>{item.date}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}



