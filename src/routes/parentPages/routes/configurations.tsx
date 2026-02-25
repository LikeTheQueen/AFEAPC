import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { NavLink } from "react-router";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { activeTab } from "src/helpers/styleHelpers";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

const tabs = [
  { id:1, name: 'Partner Library', href: "/mainscreen/configurations/", current: false, 
  sublist: [
  {id:1, name:"Upload Partner List", current: false, href:"partnerupload", mobile: false},
  {id:2, name:"Map Partner Library", current: false, href:"partnermapping", mobile: false},
  {id:3, name:"View & Manage Partner Mappings", current: false, href:"partnermappingview", mobile: true},
  {id:4, name:"View & Manage Partner Library", current: false, href:"partnersview", mobile: true},
]},
  { id:2, name: 'GL Library', href: "/mainscreen/configurations", current: false,
    sublist:[
  {id:1, name:"Upload GL Codes", current: true, href:"glfileupload", mobile: false},
  {id:2, name:"Map GL Codes", current: false, href:"glmapping", mobile: false},
  {id:3, name:"View & Manage GL Code Mappings", current: false, href:"glmappingview", mobile: true},
  {id:4, name:"View & Manage GL Codes", current: false, href:"glcodesview", mobile: true},
    ]
   },
   { id:3, name: 'System Connections', href: "/mainscreen/configurations", current: false,
    sublist:[
  {id:1, name:"Quorum Execute", current: true, href:"systemConfigurations", mobile: true},
  {id:2, name:"W Energy", current: false, href:"systemConfigurations", mobile: true},
    ] },
  { id:4, name: 'Data Integration Parameters', href: "/mainscreen/configurations", current: false,
    sublist:[
  {id:1, name:"Quorum Execute", current: true, href:"executeafefilters", mobile: false},
  {id:2, name:"W Energy", current: false, href:"partnermapping", mobile: false},
    ] },
  
];

export default function Configurations() {
  const navigate = useNavigate();
  const [tabList, setTabList] = useState(tabs);
  const [currentTab, setCurrentTab] = useState(1);
  const [currentSubTab, setCurrentSubTab] = useState(0);
  const [mobileSubTab, setMobileSubtab] = useState(tabs[0]?.sublist || []);

function handleParentTabChange(selected: number){
    const updateCurrentTab = activeTab(tabs, selected);
    setCurrentTab(updateCurrentTab.selectedTabId);
    setTabList(updateCurrentTab.updatedTabs);
  };

function handleParentTabChangeMobile(selected: number) {
  const updateCurrentTab = activeTab(tabs, selected);
    setCurrentTab(updateCurrentTab.selectedTabId);
    setTabList(updateCurrentTab.updatedTabs);

  const selectedParentTabMobile = tabList.find(tab => tab.id === selected);
  if(selectedParentTabMobile?.href) {
    navigate(selectedParentTabMobile?.href)
  }
  
}
function handleSubTabChange(selected: number){
  const updateCurrentSubTab = activeTab(mobileSubTab, selected);
  setCurrentSubTab(updateCurrentSubTab.selectedTabId);
  };

function handleSubTabChangeMobile(selected: number) {
  const updateCurrentSubTab = activeTab(mobileSubTab, selected);
  setCurrentSubTab(updateCurrentSubTab.selectedTabId);
  setMobileSubtab(updateCurrentSubTab.updatedTabs);

  const selectedMobileTab = mobileSubTab.find(tab => tab.id === selected);
  if(selectedMobileTab?.href) {
    navigate(selectedMobileTab.href)
  }
  };

useEffect(() => {
  const sublist = tabs.find(item => item.id === currentTab)?.sublist || [];
  const withBlankOption = [
    { id: 0, name: '', current: true, href: "" , mobile: true},
    ...sublist.map(item => ({ ...item, current: false }))
  ];
  setMobileSubtab(withBlankOption);
  setCurrentSubTab(0);
  
},[currentTab])

  return (
    <div className="px-4 sm:px-10 sm:py-4">
      <div className="h-4 backdrop-blur-xs sm:sticky z-11 sm:top-16"></div>

      <div className="grid grid-cols-1 sm:hidden">
              {}
              <select
                value={tabList.find((tab) => tab.current)?.id || ''}
                onChange={e => {handleParentTabChangeMobile(parseInt(e.target.value, 10))}}
                aria-label="Select a tab"
                name='MobileMenu'
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
      <div className="grid grid-cols-1 mt-2 sm:hidden">
              {}
              <select
                value={mobileSubTab.find((tab) => tab.current)?.id || ''}
                onChange={e => {handleSubTabChangeMobile(parseInt(e.target.value, 10))}}
                aria-label="Select a tab"
                name='DesktopMenu'
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 custom-style text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--darkest-teal)]">
                {mobileSubTab.map((tab) => (
                  <option key={tab.id} value={tab.id} hidden={!tab.mobile}>{tab.name}</option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 gap-x-8 mr-2 size-5 self-center justify-self-end fill-[var(--darkest-teal)]"
              />
      </div>
      <div className="hidden sm:flex ">
        <div className="pb-0 flex flex-1 rounded-t-md border border-[var(--darkest-teal)]">
        {tabList.map((item, index) => (
          <div key={item.id} className="relative isolate flex w-full">    
        <Popover className="relative isolate z-50 flex w-full">
          <PopoverButton
          as={NavLink}
          to={item.href}
          onClick={e => handleParentTabChange(item.id)}
          className={`inline-flex flex-1 justify-center items-center px-4 py-3 custom-style transition-colors ease-in-out duration-300 text-base/7
            ${item.current
                  ? 'bg-[var(--darkest-teal)] text-white border-t-3 border-t-[var(--bright-pink)] py-4 font-medium underline decoration-[var(--bright-pink)] decoration-3 underline-offset-8'
                  : 'bg-white text-[var(--darkest-teal)] transition-colors ease-in-out duration-300 hover:bg-[var(--darkest-teal)] hover:text-white hover:font-semibold font-normal hover:underline hover:decoration-3 hover:underline-offset-8 hover:decoration-[var(--bright-pink)]'}
              ${index !== 0 ? 'border-l border-[var(--darkest-teal)]' : ''}
              ${index === 0 ? 'rounded-tl-md' : ''}
              ${index === tabList.length - 1 ? 'rounded-tr-md' : ''}
              `}>
              <span className="">{item.name}</span>
              <span ><ChevronDownIcon aria-hidden="true" className="size-5" /></span>
            </PopoverButton>
            {item.sublist.length > 0 && (
      <PopoverPanel 
      transition
      className="absolute inset-x-0 top-16 rounded-b-md w-full bg-[var(--darkest-teal)] text-white data-closed:-translate-y-0 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-in data-leave:duration-150 data-leave:ease-out ">
        <div
          aria-hidden="true"
          className="absolute inset-0 shadow-xl "
        />
        <div className="relative">
          <div className=" flex flex-col ">
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
    </div>
  )
}
