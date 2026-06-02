import { useState, useEffect } from 'react';
import supabase from "provider/supabase";
import type { Session } from "@supabase/supabase-js";
import { useNavigate, useLocation } from 'react-router';
import "../../../style.css";
import { APP_LOGO, resendOTPCoolDown } from 'src/constants/variables';
import { notifyFailure, notifyStandard } from 'src/helpers/helpers';
import { useSearchParams } from 'react-router';
import { writeToFunctionLogs } from 'provider/write';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorSupabase, setErrorSupabase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hideVerification, setHideVerification] = useState(true);
  const [session, setSession] = useState<Session | null>();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const from = searchParams.get('redirectTo') ?? '/mainscreen/afe'
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  const sendOTP = async() => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

    
      if (error) throw error;
     
    } catch (error: unknown) {
      setErrorSupabase(error instanceof Error ? error.message : 'An error occurred');
      notifyFailure(error instanceof Error ? error.message : 'Unable to send OTP email.  Are you sure you are an authorized user?');
      writeToFunctionLogs('Send User OTP Email',error instanceof Error ? error.message : 'An error occurred', error as JSON, 'ERROR', `${email} trying to logon`)
    } finally {
      setIsLoading(false)
    }
  };
  
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await sendOTP();
  };

  if (session === undefined) return null;

  return (
    <>
    <div className="h-full bg-[var(--darkest-teal)] flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="AFE Partner Connections"
        src={APP_LOGO}
        className="mx-auto h-10 w-auto"
      />

    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form method="POST" className="space-y-6">
        <div hidden={!hideVerification}>
          <label htmlFor="email" className="block text-base/6 font-medium text-white custom-style">
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
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 custom-style text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-white/20 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
            />
          </div>
        </div>
        <div hidden={!hideVerification}>
          <label htmlFor="password" className="block text-base/6 font-medium text-white custom-style">
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              required
              autoComplete={"current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 custom-style text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-white/20 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
            />
          </div>
        </div>
        <div hidden={!hideVerification}>
          <button
            name='getVerification'
            type="button"
            onClick={handleLogin}
            className="flex w-full justify-center rounded-md bg-[var(--bright-pink)] px-3 py-1.5 text-base/6 font-semibold text-white shadow-xs custom-style hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:bg-white disabled:text-[var(--darkest-teal)]/40 disabled:cursor-not-allowed" 
            disabled={isLoading || !isValidEmail(email)}>
            {'Login'}
          </button>
        </div>
      </form>
      
    </div>
    <div>
      
    </div>
  </div>
  </>
  )
}
