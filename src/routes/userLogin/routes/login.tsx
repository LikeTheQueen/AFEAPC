import { useState, useEffect } from 'react';
import supabase from "provider/supabase";
import type { Session } from "@supabase/supabase-js";
import { useNavigate, useLocation } from 'react-router';
import OTPInput from './otpInput';
import "../../../style.css";
import { APP_LOGO, resendOTPCoolDown } from 'src/constants/variables';
import { notifyFailure, notifyStandard } from 'src/helpers/helpers';
import { useSearchParams } from 'react-router';
import { otpLength } from 'src/constants/variables';
import { writeToFunctionLogs } from 'provider/write';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState<string[]>(Array(otpLength).fill(''));
  const [errorSupabase, setErrorSupabase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hideVerification, setHideVerification] = useState(true);
  const [session, setSession] = useState<Session | null>();
  const [resendCooldown, setResendCooldown] = useState(0);

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

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const sendOTP = async() => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      setHideVerification(false);
      setResendCooldown(resendOTPCoolDown);
     
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

  const handleOTP = async(pin: string) => {
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: pin,
        type: 'email',
        
      });

      if (error) throw error;
      
    } catch (error: unknown) {
      setErrorSupabase(error instanceof Error ? error.name : 'An error occurred');
      notifyFailure(error instanceof Error ? error.message : 'Invalid or expired code.');
      setOTP(Array(otpLength).fill(''));
      writeToFunctionLogs('User Enter OTP',error instanceof Error ? error.message : 'An error occurred', error as JSON, 'ERROR', `${email} trying to logon`)
    } finally {
      setIsLoading(false)
    }
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
          <button
            name='getVerification'
            type="button"
            onClick={handleLogin}
            className="flex w-full justify-center rounded-md bg-[var(--bright-pink)] px-3 py-1.5 text-base/6 font-semibold text-white shadow-xs custom-style hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:bg-white disabled:text-[var(--darkest-teal)]/40 disabled:cursor-not-allowed" 
            disabled={isLoading || !isValidEmail(email) || resendCooldown > 0}>
            {resendCooldown > 0 ? `Request Verification Code Again in ${resendCooldown}s`: 'Get Verification Code'}
          </button>
        </div>
        <div hidden={resendCooldown <= 0 || (resendCooldown > 0 && !hideVerification)}>
          <button
            name='enterOTP'
            type="button"
            onClick={(e) => setHideVerification(false)}
            className="flex w-full justify-center rounded-md bg-[var(--bright-pink)] px-3 py-1.5 text-base/6 font-semibold text-white shadow-xs custom-style hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:bg-[var(--darkest-teal)] disabled:text-[var(--darkest-teal)]/40" 
            //disabled={isLoading || !isValidEmail(email)}
            >
            I Have the Verification Code
          </button>
        </div>
        <div hidden={hideVerification}>
            <label htmlFor="otp" className="text-lg/6 font-medium text-white custom-style align-center">
            Verification Code
          </label>
            <p className="mt-6 text-base/6 text-white custom-style-long-text">If your email address is associated to an active user you will be sent a verification code.</p>
            <br></br>
            <p className="mb-10 text-base/6 text-white custom-style-long-text">Check with your orgamozation's admin if you have questions.</p>
            <OTPInput otp={otp} length={otpLength} onComplete={handleOTP} onPinChange={(otp) => setOTP(otp)} onHideVerification={(hideVerification => setHideVerification(hideVerification))} />
        </div>
        
      </form>
      
    </div>
    <div>
      
    </div>
  </div>
  </>
  )
}
