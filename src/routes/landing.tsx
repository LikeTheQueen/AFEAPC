import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useNavigate } from "react-router";
import  Footer  from "./footer"

const navigation = [
   { name: 'How it Works', href: '#' },
   { name: 'AFE Systems', href: '#' },
   { name: 'About', href: '#' }
 ];
export default function LandingPage() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const navigate = useNavigate();

return <div>
    <section className="relative py-6 overflow-hidden bg-black sm:pb-16 lg:pb-20 xl:pb-24" aria-label='landingPage'>
        <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8 border-b-1 border-b-white/50">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">AFE partner Connections</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-8" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12 justify-center w-3/5">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.href} className="text-md/6 text-center px-6 py-2 font-normal text-white custom-style rounded-full inset-px hover:bg-[var(--bright-pink)]">
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          
          <div className="relative inline-flex items-center justify-center group">
                        <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-[var(--dark-teal)] to-[var(--bright-pink)] group-hover:shadow-lg group-hover:shadow-[#F61067]"></div>
                        
                        <NavLink to='login' className="relative inline-flex items-center justify-center w-full px-6 py-2 custom-style font-normal text-white bg-black border border-transparent rounded-full" role="button"> Login </NavLink>
                    </div>
          </div>
          
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
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
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
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
        
        <div className="px-4 mx-auto relativea sm:px-6 lg:px-8 max-w-7xl">
        
            <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16">
                <div>
                <h1 className="mt-10 text-5xl tracking-tight text-pretty text-white sm:text-7xl custom-style">
                Streamline your AFE Partner Workflow
               </h1>
      
                    <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8 custom-style-long-text">Generate faster AFE responses from your partners with direct integrations to your AFE System, automated alerts and email notifications, and a complete audit history</p>

                    <div className="relative mt-8 rounded-full sm:mt-12">
                        <div className="relative">
                            <div className="absolute rounded-full -inset-0.5 bg-gradient-to-r from-[var(--bright-pink)] via-[var(--dark-teal)] to-[var(--dark-teal)] "></div>
                            <div className="relative">
                                <p className="block w-full p-0  text-white/80 bg-black rounded-full pl-6 sm:py-5 custom-style">Want to know more?</p>
                            </div>
                        </div>
                        <div className="sm:absolute flex sm:right-1.5 sm:inset-y-1.5 mt-4 sm:mt-0">
                            <button type="submit" className="inline-flex items-center justify-center w-full px-12 py-1 text-sm font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:bg-[var(--bright-pink)]/80 hover:text-white">Let's Talk</button>
                        </div>
                    </div>

                    
                </div>

                <div className="relative">
                    <div className="absolute inset-0">
                        <svg className="blur-3xl filter opacity-70"  width="444" height="536" viewBox="0 0 444 536" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M225.919 112.719C343.98 64.6648 389.388 -70.487 437.442 47.574C485.496 165.635 253.266 481.381 135.205 529.435C17.1445 577.488 57.9596 339.654 9.9057 221.593C-38.1482 103.532 107.858 160.773 225.919 112.719Z" fill="url(#c)" />
                            <defs>
                                <linearGradient id="c" x1="82.7339" y1="550.792" x2="-39.945" y2="118.965" gradientUnits="userSpaceOnUse">
                                <stop stopOpacity="80" offset="0%" stopColor="var(--dark-teal)" />
                                <stop offset="100%" stopColor="var(--bright-pink)" /> 

                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="absolute inset-0">
                        <img className="object-cover w-full h-full opacity-50" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/noise.png" alt="" />
                    </div>

                    <img className="relative w-full max-w-md mx-auto mt-12" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/2/illustration.png" alt="" />
                </div>
            </div>
        </div>
    </section>
    <Footer/>
    </div>;
  }