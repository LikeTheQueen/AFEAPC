import { useState } from 'react';
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from "react-router";
import  Footer  from "./footer"
import LiquidEther from '../blocks/LiquidEther';
import StarBorder from 'src/blocks/StarBorder';
import FloatingLines from 'src/blocks/FloatingLines';
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import "../style.css";


const navigation = [
   { name: 'How it Works', href: '#' },
   { name: 'AFE Systems', href: '#' },
   { name: 'About', href: '#' },
   { name: 'Contact Us', href: '#' }
 ];

const mainNavigation = [
  {
    id: 1, name: 'How it Works', href: "#", current: true,
    sublist: []
  },
  {
    id: 2, name: 'AFE Systems', href: "#", current: false,
    sublist: [
      { id: 1, name: "Quorum Execute", current: false, href: "#", mobile: false },
      { id: 2, name: "W Energy", current: false, href: "#", mobile: false },
    ]
  },
  {
    id: 3, name: 'About', href: "#", current: false,
    sublist: []
  },
  {
    id: 4, name: 'Contact Us', href: "#", current: false,
    sublist: []
  },
]
 
export default function LandingPage() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const navigate = useNavigate();

return (
  <>
  <div className='bg-black'>
    <section className="relative overflow-visible py-6 sm:pb-16 z-6" aria-label='landingPage'>
        <nav aria-label="Global" className="flex items-center justify-between p-4 sm:px-8 border-b border-white/50">
          {/* Logo - Left */}
          <div className="flex">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">AFE partner Connections</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-8" />
            </button>
          </div>

          {/* Menu items - Center */}
          <div className="hidden sm:flex sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <div className="flex gap-2">
              {mainNavigation.map((item, index) => (
                <div key={item.id} className="relative">
                  <Popover className="relative z-50 ">
                    <PopoverButton
                      as={NavLink}
                      to={item.href}
                      className={`rounded-lg inline-flex items-center gap-1 px-4 py-3 custom-style transition-colors ease-in-out duration-300 text-base leading-7 text-white whitespace-nowrap focus:outline-none focus-visible:outline-none
                ${item.current
                          ? 'font-medium underline decoration-[var(--bright-pink)] decoration-3 underline-offset-8'
                          : 'font-normal hover:bg-[var(--bright-pink)] hover:font-semibold hover:underline hover:decoration-3 hover:underline-offset-8 hover:decoration-white'
                        }`}
                    >
                      <span>{item.name}</span>
                      {item.sublist.length > 0 && (
                        <ChevronDownIcon aria-hidden="true" className="size-5" />
                      )}
                    </PopoverButton>

                    {item.sublist.length > 0 && (
                      <PopoverPanel
                        transition
                        className="absolute left-0 top-full rounded-md min-w-48 bg-black backdrop-blur-sm text-white shadow-xl transition data-closed:-translate-y-1 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
                        <div className="py-2 z-51">
                          {item.sublist.map((sub) => (
                            <PopoverButton
                              key={sub.id}
                              as={NavLink}
                              to={sub.href}
                              className="rounded-lg block px-4 py-3 custom-style text-white font-normal hover:bg-[var(--bright-pink)] hover:font-semibold transition-colors"
                            >
                              {sub.name}
                            </PopoverButton>
                          ))}
                        </div>
                      </PopoverPanel>
                    )}
                  </Popover>
                </div>
              ))}
            </div>
          </div>

          {/* Login button - Right */}
          <div className="hidden sm:flex">
            <div className="relative inline-flex items-center justify-center group">
              <div className="absolute -inset-px transition-all duration-200 rounded-lg bg-gradient-to-r from-[var(--dark-teal)] to-[var(--bright-pink)] group-hover:shadow-lg group-hover:shadow-[#F61067]"></div>
              <NavLink
                to='login'
                className="relative inline-flex items-center justify-center px-6 py-2 custom-style font-normal text-white bg-black border border-transparent rounded-lg"
                role="button">
                Login
              </NavLink>
            </div>
          </div>

        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="sm:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">AFE Partner Connections</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-white"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-100/25">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-normal text-white custom-style hover:bg-gray-800"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <NavLink
                    
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white custom-style hover:bg-gray-800" to="login">
                    Login
                  </NavLink>
                </div>
                
              </div>
            </div>
          </DialogPanel>
        </Dialog>
    </section>
      <section className="relative w-full h-full bg-black/60">
        {/* Background layer */}
        <div className="absolute inset-0 z-5">
          <LiquidEther
            colors={['#FF4FA3', '#FF6FB7', '#FF5CAB']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={true}
            autoDemo={false}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.15}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Foreground content */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-y-0 sm:grid-cols-2 gap-x-16">
              <div className='col-span-2'>
                <h1 className="mt-10 text-5xl tracking-tight text-pretty text-white sm:text-7xl custom-style">
                  Streamline your AFE Partner Workflow
                </h1>
                </div>
                <p className="col-span-2 sm:col-span-1 mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8 custom-style-long-text">
                  Generate faster AFE responses from your partners with direct integrations to your AFE System, automated alerts and email notifications all with a complete audit history
                </p>
                <div className="row-start-3 col-start-2 relative mt-8 mb-8 rounded-full sm:mt-12 z-6">
                  <div className="relative">
                    <div className="absolute rounded-full -inset-0.5 bg-gradient-to-r from-[var(--bright-pink)] via-[var(--dark-teal)] to-[var(--dark-teal)]"></div>
                    <div className="relative">
                      <p className="block w-full p-0 text-white/80 bg-black rounded-full pl-6 sm:py-5 custom-style">
                        Want to know more?
                      </p>
                    </div>
                  </div>
                  <div className="sm:absolute flex sm:right-1.5 sm:inset-y-1.5 mt-4 sm:mt-0 z-6">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-full px-12 py-1 text-sm/6 font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:bg-[var(--bright-pink)]/80 hover:text-white cursor-pointer"
                    >
                      Let's Talk
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>
    <Footer/>
  </div>
  
  </>
)
  }
