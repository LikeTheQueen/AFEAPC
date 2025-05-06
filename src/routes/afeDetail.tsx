import { useSupabaseData } from "../types/SupabaseContext";
import type { Route } from "../routes/+types/afeDetail";
import { useLocation, useParams } from 'react-router';
import { useMemo, useState } from 'react';
import type { AFEType } from "../types/interfaces";
import {
    Dialog,
    DialogPanel,
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import {

    CalendarDaysIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    PaperClipIcon,
    UserCircleIcon,
    XMarkIcon as XMarkIconMini,
} from '@heroicons/react/20/solid'
import {
    ChartBarSquareIcon,
    BellIcon,
    Cog6ToothIcon,
    FolderIcon,
    GlobeAltIcon,
    ServerIcon,
    SignalIcon,
    XMarkIcon as XMarkIconOutline,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

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
const invoice = {
    subTotal: '$8,800.00',
    tax: '$1,760.00',
    total: '$10,560.00',
    items: [
        {
            id: 1,
            title: 'Logo redesign',
            description: 'New logo and digital asset playbook.',
            hours: '20.0',
            rate: '$100.00',
            price: '$2,000.00',
        },
        {
            id: 2,
            title: 'Website redesign',
            description: 'Design and program new company website.',
            hours: '52.0',
            rate: '$100.00',
            price: '$5,200.00',
        },
        {
            id: 3,
            title: 'Business cards',
            description: 'Design and production of 3.5" x 2.0" business cards.',
            hours: '12.0',
            rate: '$100.00',
            price: '$1,200.00',
        },
        {
            id: 4,
            title: 'T-shirt design',
            description: 'Three t-shirt design concepts.',
            hours: '4.0',
            rate: '$100.00',
            price: '$400.00',
        },
    ],
}
const activity = [
    { id: 1, type: 'created', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
    { id: 2, type: 'edited', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
    { id: 3, type: 'sent', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
    {
        id: 4,
        type: 'commented',
        person: {
            name: 'Chelsea Hagon',
            imageUrl:
                'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        comment: 'Called client, they reassured me the invoice would be paid by the 25th.',
        date: '3d ago',
        dateTime: '2023-01-23T15:56',
    },
    { id: 5, type: 'viewed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
    { id: 6, type: 'paid', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
]
const moods = [
    { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
    { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
    { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
    { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
    { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
    { name: 'I feel nothing', value: null, icon: XMarkIconMini, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
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
/*
function returnSingleAFE(id: string) {
    const { afes } = useSupabaseData();
    const singleAFE = afes?.filter((afe) => {
        return afe.id === id
    })
    return singleAFE?.[0]
}
    
export function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log(params);  
  return params;
}
*/
export default function AFEDetailURL() {
  const { afes } = useSupabaseData();
  const { afeID } = useParams();

const singleAFE = useMemo(() => {
  return afes?.find((afe) => afe.id === afeID);
}, [afes, afeID]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [selected, setSelected] = useState(moods[5])

    return (
        <>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* AFE Actions */}
            <div className="relative isolate pt-0 lg:col-start-3 lg:row-end-1 ">
            <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-full left-1 -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
              <div
                style={{
                  clipPath:
                    'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                }}
                className="aspect-1154/678 w-[72.125rem] bg-linear-to-tl from-[var(--bright-pink)] to-[var(--darkest-teal)]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px " />
          </div>

          <div className="mx-auto max-w-7xl px-1 py-1 sm:px-1 lg:px-2">
            <div className="mx-auto flex items-center max-w-2xl items-center justify-between gap-x-1 lg:mx-0 lg:max-w-none">
            <button type="button" className="hidden text-sm/6 font-semibold custom-style text-[var(--darkest-teal)] sm:block">
                  Share AFE {singleAFE?.afe_number} the number
                </button>
              <div className="flex items-center gap-x-4 sm:gap-x-6">
              <a
                  href="#"
                  className="rounded-md bg-red-800 px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
                  Reject
                </a>
                
                <a
                  href="#"
                  className="rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm font-semibold custom-style text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Accept
                </a>
                

                <Menu as="div" className="relative sm:hidden">
                  <MenuButton className="-m-3 block p-3">
                    <span className="sr-only">More</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="size-5 text-gray-500" />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-[var(--dark-teal)]/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <button
                        type="button"
                        className="block w-full px-3 py-1 text-left text-sm/6 text-[var(--dark-teal)] data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        Share AFE
                      </button>
                    </MenuItem>
                    
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
              
            </div>
            

            {/* Invoice */}
            <div className="-mx-4 px-4 py-8 shadow-xs ring-1 ring-[var(--dark-teal)]/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pt-16 xl:pb-20">
            <h2 className="sr-only">AFE Estimates</h2>
              <div className="rounded-lg bg-gray-50 shadow-xs ring-1 ring-[var(--dark-teal)]/5">
              
                <dl className="flex flex-wrap">
                  <div className="flex-auto pt-6 pl-6">
                    <dt className="text-sm/6 font-semibold custom-style text-[var(--dark-teal)]">Amount</dt>
                    <dd className="mt-1 text-base font-semibold custom-style text-[var(--dark-teal)]">$10,560.00</dd>
                  </div>
                  <div className="flex-none self-end px-6 pt-4">
                    <dt className="sr-only">Status</dt>
                    <dd className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-green-600/20 ring-inset">
                      Paid
                    </dd>
                  </div>
                  <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-[var(--dark-teal)]/5 px-6 pt-6">
                    <dt className="flex-none">
                      <span className="sr-only">Client</span>
                      <UserCircleIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
                    </dt>
                    <dd className="text-sm/6 font-medium text-[var(--dark-teal)]">Alex Curren</dd>
                  </div>
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">Due date</span>
                      <CalendarDaysIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
                    </dt>
                    <dd className="text-sm/6 text-gray-500">
                      <time dateTime="2023-01-31">January 31, 2023</time>
                    </dd>
                  </div>
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">Status</span>
                      <CreditCardIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
                    </dt>
                    <dd className="text-sm/6 text-gray-500">Paid with MasterCard</dd>
                  </div>
                </dl>
                <div className="mt-6 border-t border-[var(--dark-teal)]/5 px-6 py-6">
                  <a href="#" className="text-sm/6 font-semibold custom-style text-[var(--dark-teal)]">
                    Download receipt <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
              <h2 className="text-base font-semibold custom-style text-[var(--darkest-teal)]">AFE Estimates</h2>
              <dl className="mt-6 grid grid-cols-1 text-sm/6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <dt className="inline text-gray-500">Issued on</dt>{' '}
                  <dd className="inline text-gray-700">
                    <time dateTime="2023-23-01">January 23, 2023</time>
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">Due on</dt>{' '}
                  <dd className="inline text-gray-700">
                    <time dateTime="2023-31-01">January 31, 2023</time>
                  </dd>
                </div>
                <div className="mt-6 border-t border-[var(--dark-teal)]/5 pt-6 sm:pr-4">
                  <dt className="font-semibold custom-style text-[var(--dark-teal)]">From</dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-[var(--dark-teal)]">Acme, Inc.</span>
                    <br />
                    7363 Cynthia Pass
                    <br />
                    Toronto, ON N3Y 4H8
                  </dd>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-[var(--dark-teal)]/5 sm:pt-6 sm:pl-4">
                  <dt className="font-semibold custom-style text-[var(--dark-teal)]">To</dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-[var(--dark-teal)]">Tuple, Inc</span>
                    <br />
                    886 Walter Street
                    <br />
                    New York, NY 12345
                  </dd>
                </div>
              </dl>
              <table className="mt-16 w-full text-left text-sm/6 whitespace-nowrap">
                <colgroup>
                  <col className="w-full" />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="border-b border-gray-200 text-[var(--dark-teal)]">
                  <tr>
                    <th scope="col" className="px-0 py-3 font-semibold custom-style">
                      Projects
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold custom-style sm:table-cell">
                      Hours
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold custom-style sm:table-cell">
                      Rate
                    </th>
                    <th scope="col" className="py-3 pr-0 pl-8 text-right font-semibold custom-style">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="max-w-0 px-0 py-5 align-top">
                        <div className="truncate font-medium text-[var(--dark-teal)]">{item.title}</div>
                        <div className="truncate text-gray-500">{item.description}</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.hours}
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {item.rate}
                      </td>
                      <td className="py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" className="px-0 pt-6 pb-0 font-normal text-gray-700 sm:hidden">
                      Subtotal
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden px-0 pt-6 pb-0 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Subtotal
                    </th>
                    <td className="pt-6 pr-0 pb-0 pl-8 text-right text-[var(--dark-teal)] tabular-nums">{invoice.subTotal}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pt-4 font-normal text-gray-700 sm:hidden">
                      Tax
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Tax
                    </th>
                    <td className="pt-4 pr-0 pb-0 pl-8 text-right text-[var(--dark-teal)] tabular-nums">{invoice.tax}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pt-4 font-semibold custom-style text-[var(--dark-teal)] sm:hidden">
                      Total
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-semibold custom-style text-[var(--dark-teal)] sm:table-cell"
                    >
                      Total
                    </th>
                    <td className="pt-4 pr-0 pb-0 pl-8 text-right font-semibold custom-style text-[var(--dark-teal)] tabular-nums">
                      {invoice.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="lg:col-start-3">
              {/* Activity feed */}
              <h2 className="text-sm/6 font-semibold custom-style text-[var(--dark-teal)]">Activity</h2>
              <ul role="list" className="mt-6 space-y-6">
                {activity.map((activityItem, activityItemIdx) => (
                  <li key={activityItem.id} className="relative flex gap-x-4">
                    <div
                      className={classNames(
                        activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
                        'absolute top-0 left-0 flex w-6 justify-center',
                      )}
                    >
                      <div className="w-px bg-gray-200" />
                    </div>
                    {activityItem.type === 'commented' ? (
                      <>
                        <img
                          alt=""
                          src={activityItem.person.imageUrl}
                          className="relative mt-3 size-6 flex-none rounded-full bg-gray-50"
                        />
                        <div className="flex-auto rounded-md p-3 ring-1 ring-gray-200 ring-inset">
                          <div className="flex justify-between gap-x-4">
                            <div className="py-0.5 text-xs/5 text-gray-500">
                              <span className="font-medium text-[var(--dark-teal)]">{activityItem.person.name}</span> commented
                            </div>
                            <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs/5 text-gray-500">
                              {activityItem.date}
                            </time>
                          </div>
                          <p className="text-sm/6 text-gray-500">{activityItem.comment}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                          {activityItem.type === 'paid' ? (
                            <CheckCircleIcon aria-hidden="true" className="size-6 text-indigo-600" />
                          ) : (
                            <div className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                          )}
                        </div>
                        <p className="flex-auto py-0.5 text-xs/5 text-gray-500">
                          <span className="font-medium text-[var(--dark-teal)]">{activityItem.person.name}</span>{' '}
                          {activityItem.type} the invoice.
                        </p>
                        <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs/5 text-gray-500">
                          {activityItem.date}
                        </time>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* New comment form */}
              <div className="mt-6 flex gap-x-3">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-6 flex-none rounded-full bg-gray-50"
                />
                <form action="#" className="relative flex-auto">
                  <div className="overflow-hidden rounded-lg pb-12 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <label htmlFor="comment" className="sr-only">
                      Add your comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={2}
                      placeholder="Add your comment..."
                      className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-[var(--dark-teal)] placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      defaultValue={''}
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pr-2 pl-3">
                    <div className="flex items-center space-x-5">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="-m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        >
                          <PaperClipIcon aria-hidden="true" className="size-5" />
                          <span className="sr-only">Attach a file</span>
                        </button>
                      </div>
                      <div className="flex items-center">
                        <Listbox value={selected} onChange={setSelected}>
                          <Label className="sr-only">Your mood</Label>
                          <div className="relative">
                            <ListboxButton className="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                              <span className="flex items-center justify-center">
                                {selected.value === null ? (
                                  <span>
                                    <FaceSmileIcon aria-hidden="true" className="size-5 shrink-0" />
                                    <span className="sr-only">Add your mood</span>
                                  </span>
                                ) : (
                                  <span>
                                    <span
                                      className={classNames(
                                        selected.bgColor,
                                        'flex size-8 items-center justify-center rounded-full',
                                      )}
                                    >
                                      <selected.icon aria-hidden="true" className="size-5 shrink-0 text-white" />
                                    </span>
                                    <span className="sr-only">{selected.name}</span>
                                  </span>
                                )}
                              </span>
                            </ListboxButton>

                            <ListboxOptions
                              transition
                              className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow-sm ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:ml-auto sm:w-64 sm:text-sm"
                            >
                              {moods.map((mood) => (
                                <ListboxOption
                                  key={mood.value}
                                  value={mood}
                                  className="relative cursor-default bg-white px-3 py-2 select-none data-focus:bg-gray-100"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={classNames(
                                        mood.bgColor,
                                        'flex size-8 items-center justify-center rounded-full',
                                      )}
                                    >
                                      <mood.icon
                                        aria-hidden="true"
                                        className={classNames(mood.iconColor, 'size-5 shrink-0')}
                                      />
                                    </div>
                                    <span className="ml-3 block truncate font-medium">{mood.name}</span>
                                  </div>
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </div>
                        </Listbox>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold custom-style text-[var(--dark-teal)] shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    >
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
        </>
    )
}



