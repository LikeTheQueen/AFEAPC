import { useRef, useState } from 'react';

type InputProps = {
  length?: number;
  onComplete: (pin: string) => void;
};

const OTPInput = ({ length = 4, onComplete }: InputProps) => {  
const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));

const handlePaste = (e: any) => {
    e.preventDefault(); 

    const pastedData = e.clipboardData.getData('text');
    const newPin = [...OTP]; 

    for (let i = 0; i < pastedData.length && i < newPin.length; i++) {
      newPin[i] = pastedData[i]; 
    }
    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''));
    }
    setOTP(newPin);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, newPin.length - 1);
    if (inputRef.current[lastFilledIndex]) {
      inputRef.current[lastFilledIndex].focus();
    }
  };

const handleTextChange = (input: string, index: number) => {
    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);

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
    <div className="grid grid-cols-6 gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={OTP[index]}
          onChange={(e) => handleTextChange(e.target.value, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          ref={(ref) => {(inputRef.current[index] = ref as HTMLInputElement)}}
          className="text-center block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-[var(--darkest-teal)]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
        />
      ))}
    </div>
  );
};

export default OTPInput;