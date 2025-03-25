'use client'

import { useState } from 'react';
import { Outlet } from "react-router";
import { NavLink } from "react-router";
import "../style.css";

import { ChevronDownIcon } from '@heroicons/react/16/solid'

const tabs = [
  
  { id:1, name: 'Partner Library', href: "/configurations/partnerlibrary", current: true },
  { id:2, name: 'GL Library', href: "/configurations/gllibrary", current: false },
  { id:3, name: 'Data Export', href: "/configurations/dataexport", current: false },
  { id:4, name: 'System Connections', href: "/configurations/systemConfigurations", current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Configurations() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:hidden">
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          defaultValue={tabs.find((tab) => tab.current).name}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 custom-style text-[var(--dark-teal)] outline-1 -outline-offset-1 outline-[var(--darkest-teal)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--darkest-teal)]"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 gap-x-8 mr-2 size-5 self-center justify-self-end fill-[var(--darkest-teal)]"
        />
      </div>
      <div className="hidden sm:block">
        <div className="">
          <nav aria-label="Tabs" className="-mb-px flex gap-x-8">
            {tabs.map((item) => (
                
                <NavLink
                key={item.id}
                to={item.href}
                className={({isActive})=>
                isActive
                ? 'w-1/4 border-3 px-1 py-4 text-center border-[var(--darkest-teal)] text-[var(--darkest-teal)] custom-style font-semibold hover:bg-[var(--dark-teal)] hover:text-white'
                
                : 'w-1/4 border px-1 py-4 text-center text-m font-medium custom-style hover:border-b-2 hover:border hover:border-b-2-[var(--darkest-teal)] hover:text-white hover:font-semibold hover:bg-[var(--dark-teal)]'
                }
                  
  
                >
                  
                  <span className="">{item.name}</span>
                  
                </NavLink>
              
            ))}
          </nav>
          <div><Outlet /></div>
        </div>
      </div>
    </div>
  )
}
