import { NavLink } from "react-router";
import LiquidEther from "src/blocks/LiquidEther";
import BlurText from "src/blocks/TextAnimations/BlurText";

export default function Homepage() {
    return (
        <div className='bg-black'>
        <section className="relative w-full h-full bg-black/10">
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
              <div className='sm:col-span-2'>
                <div className="mt-10 text-5xl tracking-tight text-pretty text-white sm:text-7xl custom-style">
                                    <BlurText
                                        text="Streamline your AFE Partner Workflow"
                                        delay={200}
                                        animateBy="words"
                                        direction="top"
                                        className="text-5xl tracking-tight text-pretty text-white sm:text-7xl custom-style"
                                    />

                </div>
                
                </div>
                <div className='sm:col-span-2'>
                    <p className="mt-8 text-lg font-normal text-white/90 sm:text-xl/10 custom-style-subheader-regular-case">
                  Generate faster AFE responses from your partners with direct integrations to your AFE System, automated alerts and email notifications. 
                </p>
                <p className="text-lg font-normal text-white/90 sm:text-xl/10 custom-style-subheader-regular-case">
                  All with a complete audit history
                </p>
                </div>
                <div className="row-start-3 sm:col-start-2 w-9/10 mx-auto sm:w-3/4 mt-8 mb-8 sm:mt-12 relative rounded-full z-6 self-center sm:self-end">
                                <div className="relative">
                                    <div className="absolute rounded-full -inset-0.5 bg-gradient-to-r from-[var(--bright-pink)] via-[var(--dark-teal)] to-[var(--dark-teal)]"></div>
                                    <div className="relative">
                                        <p className="flex items-center min-h-10 p-0 text-sm/6 sm:text-lg/7 text-white/80 bg-black rounded-full pl-3 sm:pl-6 py-3 sm:py-5 custom-style">
                                            Want to know more?
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute flex items-center right-1.5 inset-y-1.5 pr-1 sm:pr-1 z-6 ">
                                    <NavLink
                                        to='/contactus'
                                        className="inline-flex items-center justify-center px-8 py-1 text-sm/6 font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:bg-[var(--bright-pink)]/80 hover:text-white cursor-pointer"
                                        role="button">
                                        Let's Talk
                                    </NavLink>
                                </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    )
}