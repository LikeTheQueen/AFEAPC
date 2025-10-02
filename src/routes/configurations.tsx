import { useState } from 'react';
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { NavLink } from "react-router";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { activeTab } from "src/helpers/styleHelpers";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const tabs = [
  { id:1, name: 'Partner Library', href: "/mainScreen/configurations/", current: false, 
  sublist: [
  {id:1, name:"Upload Partner List", current: true, href:"/mainScreen/configurations/partnerupload"},
  {id:2, name:"Map Partner Library", current: false, href:"/mainScreen/configurations/partnermapping"},
  {id:3, name:"View & Manage Partner Mappings", current: false, href:"/mainScreen/configurations/partnermappingview"},
]},
  { id:2, name: 'GL Library', href: "/mainScreen/configurations", current: false,
    sublist:[
  {id:1, name:"Upload GL Codes", current: true, href:"/mainScreen/configurations/glfileupload"},
  {id:2, name:"Map GL Codes", current: false, href:"/mainScreen/configurations/glmapping"},
  {id:3, name:"View & Manage GL Code Mappings", current: false, href:"/mainScreen/configurations/glmappingview"},
    ]
   },
  { id:3, name: 'Data Export', href: "/mainScreen/configurations", current: false,
    sublist:[
  {id:1, name:"Upload Export Templates", current: true, href:"/mainScreen/configurations/partnerupload"},
  {id:2, name:"Export Data", current: false, href:"/mainScreen/configurations/partnermapping"},
    ] },
  { id:4, name: 'System Connections', href: "/mainScreen/configurations", current: false,
    sublist:[
  {id:1, name:"Quorum Execute", current: true, href:"/mainScreen/configurations/systemConfigurations"},
  {id:2, name:"W Energy", current: false, href:"/mainScreen/configurations/partnermapping"},
    ] },
];

export default function Configurations() {
  const navigate = useNavigate();
  const [tabList, setTabList] = useState(tabs);
  const [currentTab, setCurrentTab] = useState(1);
  const [currentSubTab, setCurrentSubTab] = useState(1);

function handleTabChange(selected: number){
    const updateCurrentTab = activeTab(tabs, selected);
    setCurrentTab(updateCurrentTab.selectedTabId);
    setTabList(updateCurrentTab.updatedTabs);
  };

function handleSubTabChange(selected: number){
  setCurrentSubTab(selected);
  
};

  return (
    <form onSubmit={(e) => e.preventDefault()}>
    <div className="px-4 sm:px-10 ">
      <div className="h-16 backdrop-blur-xs sm:sticky z-11 sm:top-16"></div>
      <div className="grid grid-cols-1 sm:hidden">
        {}
        <select
          onChange={e => handleTabChange(Number(e.target.value))}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 custom-style text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--darkest-teal)]">
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>{tab.name}</option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 gap-x-8 mr-2 size-5 self-center justify-self-end fill-[var(--darkest-teal)]"
        />
      </div>
      <div className="hidden sm:flex sm:sticky z-11 sm:top-32 ">
              <div className="pb-0 flex flex-1 rounded-t-md border border-[var(--darkest-teal)]">
        {tabList.map((item, index) => (
          <div key={item.id} className="relative isolate z-50 flex w-full">    
      <Popover className="relative isolate z-50 flex w-full">
          <PopoverButton
          as={NavLink}
          to={item.href}
              onClick={e => handleTabChange(item.id)}
              className={`inline-flex flex-1 justify-center xl:justify-center items-center px-0 pl-2 py-3 custom-style transition-colors ease-in-out duration-200 text-xs xl:text-lg
            ${item.current
                  ? 'bg-[var(--darkest-teal)] text-white border-t-3 border-t-[var(--bright-pink)] py-4 font-medium underline decoration-[var(--bright-pink)] decoration-3 underline-offset-8'
                  : 'bg-white text-[var(--darkest-teal)] transition-colors ease-in-out duration-300 hover:bg-[var(--darkest-teal)] hover:text-white hover:font-semibold font-normal hover:underline hover:decoration-3 hover:underline-offset-8 hover:decoration-[var(--bright-pink)]'}
              ${index !== 0 ? 'border-l border-l-1 border-[var(--darkest-teal)]' : ''}
        ${index === 0 ? 'rounded-tl-md' : ''}
        ${index === tabList.length - 1 ? 'rounded-tr-md' : ''}
              `}>
              <span className="">{item.name}</span>
              <span ><ChevronDownIcon aria-hidden="true" className="size-5" /></span>
            </PopoverButton>
            {item.sublist.length > 0 && (
      <PopoverPanel 
      transition
      className="absolute inset-x-0 top-16 w-full bg-[var(--darkest-teal)] text-white data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in ">
        <div
          aria-hidden="true"
          className="absolute inset-0 top-1/2 shadow-lg ring-1 ring-gray-900/30"
        />
        <div className="relative">
          <div className="mx-auto flex flex-col px-2 py-1 lg:px-2 xl:gap-x-8 ">
          {item.sublist.map((sub) => (
            <PopoverButton key={sub.id}
            as={NavLink}
            to={sub.href}
            onClick={e => {handleSubTabChange(sub.id) }}
            className="group relative rounded-lg p-4 custom-style hover:text-white hover:font-semibold font-normal hover:underline hover:decoration-3 hover:underline-offset-8 hover:decoration-[var(--bright-pink)]">
              {sub.name}
            </PopoverButton>
          ))}
          </div>
          </div>
        
      </PopoverPanel>
    )}
              
    </Popover>
    </div>
      ))}
    </div>
    </div>
    <div className="py-8">
    <Outlet></Outlet>
    </div>
    {/* 
            <div hidden={currentTab !==1}>
            <PartnerLibrary
             selectedSubTab={currentSubTab}>
            </PartnerLibrary>
            </div>
            <div hidden={currentTab !==2}>
            <GLLibrary/>
            </div>
            <div hidden={currentTab !==3}>
            <DataExport/>
            </div>
            <div hidden={currentTab !==4}>
            <AuthButton/>
            </div>
            */}
    </div>
    </form>
  )
}
