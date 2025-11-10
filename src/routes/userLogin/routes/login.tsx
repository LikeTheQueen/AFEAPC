import { useState, useEffect } from 'react';
import supabase from "provider/supabase";
import type { Session } from "@supabase/supabase-js";
import { useNavigate } from 'react-router';
import OTPInput from './otpInput';

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [otp, setOTP] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hideVerification, setHideVerification] = useState(true)
  const [session, setSession] = useState<Session | null>()
  const navigate = useNavigate();
  

  useEffect(() => {
  const getInitialSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
    } else {
      setSession(data.session);
    }
  };

  getInitialSession();
  
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

useEffect(() => {
    if (session) {
      navigate('/mainscreen/afe') 
    }
  }, [session])
  
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })
      if (error) throw error
     setError(error)
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.name : 'An error occurred')
    } finally {
      setIsLoading(false)
      setHideVerification(false)
    }
  }
  const handleOTP = async(pin: string) => {
   // e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        email: email,
        token: pin,
        type: 'email',
        
      })
      if (error) throw error
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.name : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <div className="h-full bg-[var(--darkest-teal)] flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="AFE Partner Connections"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        className="mx-auto h-10 w-auto"
      />

    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form method="POST" className="space-y-6">
        <div hidden={!hideVerification}>
          <label htmlFor="email" className="block text-md/6 font-medium text-white custom-style">
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 custom-style text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
            />
          </div>
        </div>
        <div hidden={!hideVerification}>
          <button
            type="button"
            onClick={handleLogin}
            className="flex w-full justify-center rounded-md bg-[var(--bright-pink)] px-3 py-1.5 text-md/6 font-semibold text-white shadow-xs custom-style hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40" disabled={isLoading || email === ''}>
            {isLoading ? 'Sending Verification Code...' : 'Get Verification Code'}
          </button>
        </div>
        <div hidden={hideVerification}>
            <label htmlFor="otp" className="text-lg/6 font-medium text-white custom-style align-center">
            Verification Code
          </label>
            <p className="mb-10 mt-2 text-md/6 text-white custom-style-info">If your email address is associated to an active user you will be sent a verification code.  Enter that below.</p>
            <OTPInput length={6} onComplete={handleOTP} />
        </div>
        
      </form>
      
    </div>
    <div>
      
    </div>
  </div>
  </>
  )
}
