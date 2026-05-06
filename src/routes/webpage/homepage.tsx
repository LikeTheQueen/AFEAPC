import LiquidEther from "src/blocks/LiquidEther";

export default function Homepage() {
    return (
        <div className='bg-black'>
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
      </div>
    )
}