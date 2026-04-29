import { useRef } from 'react';
import { otpLength } from 'src/constants/variables';
import { ArrowUturnLeftIcon } from '@heroicons/react/20/solid';

type InputProps = {
  otp: string[];
  length?: number;
  onComplete: (pin: string) => void;
  onPinChange: (newPin: string[]) => void;
  onHideVerification: (value: boolean) => void;
};

const OTPInput = ({ otp, length = otpLength, onComplete, onPinChange, onHideVerification }: InputProps) => {  
const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));

const handlePaste = (e: any) => {
    e.preventDefault(); 

    const pastedData = e.clipboardData.getData('text');
    const newPin = [...otp]; 

    for (let i = 0; i < pastedData.length && i < newPin.length; i++) {
      newPin[i] = pastedData[i]; 
    }
    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''));
    }
    
    onPinChange(newPin);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, newPin.length - 1);
    if (inputRef.current[lastFilledIndex]) {
      inputRef.current[lastFilledIndex].focus();
    }
  };

const handleTextChange = (input: string, index: number) => {
    const newPin = [...otp];
    newPin[index] = input;
    
    onPinChange(newPin);

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1].focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1].focus();
    }

    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };


  return (
    <>
    <div className="grid grid-cols-6 gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          aria-label='OTP'
          key={index}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleTextChange(e.target.value, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          ref={(ref) => {(inputRef.current[index] = ref as HTMLInputElement)}}
          className="text-center block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
        />
      ))}
    </div>
     <button
            name='backToEmail'
            type="button"
            onClick={(e) => {onHideVerification(true), onPinChange(Array(length).fill(''))}}
            className="mt-10 w-1/3 inline-flex items-center justify-around gap-x-1.5 rounded-md bg-[var(--bright-pink)] px-3 py-1.5 text-base/6 font-semibold text-white shadow-xs custom-style hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:bg-[var(--darkest-teal)] disabled:text-[var(--darkest-teal)]/40" >
             <ArrowUturnLeftIcon aria-hidden="true" className="size-5"></ArrowUturnLeftIcon> BACK
          </button>
    </>
  );
};

export default OTPInput;