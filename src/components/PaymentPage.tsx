import React, { useState } from 'react';
import svgPaths from "../imports/svg-toln6of0ig";
import { Input } from './ui/input';

interface PaymentPageProps {
  cartCount: number;
  onBack: () => void;
  onMenuClick: () => void;
  onProceedToConfirmation: () => void;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  ccv: string;
  useBillingAddress: boolean;
}

export default function PaymentPage({ cartCount, onBack, onMenuClick, onProceedToConfirmation }: PaymentPageProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    ccv: '',
    useBillingAddress: true
  });

  // Check if all required fields are filled
  const isFormValid = formData.cardNumber.trim() !== '' &&
                     formData.expiryDate.trim() !== '' &&
                     formData.ccv.trim() !== '';

  const updateFormField = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    updateFormField('cardNumber', formatted);
  };

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    updateFormField('expiryDate', formatted);
  };

  const handleCcvChange = (value: string) => {
    // Only allow digits and limit to 4 characters
    const digits = value.replace(/\D/g, '').substring(0, 4);
    updateFormField('ccv', digits);
  };

  return (
    <div className="bg-[#ffffff] relative size-full">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <Header 
        cartCount={cartCount}
        onBack={onBack}
        onMenuClick={onMenuClick}
      />
      
      {/* Progress Indicators */}
      <ProgressIndicators />
      
      {/* Divider Line */}
      <div className="absolute h-0 left-6 right-6 top-[222px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 327 1">
            <line stroke="var(--stroke-0, #E5E5E5)" x2="327" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      
      {/* Payment Label */}
      <div className="absolute flex flex-col font-['Newsreader:Regular',_sans-serif] font-normal justify-center leading-[0] left-[72px] text-[#426b1f] text-[24px] text-left top-[190px] tracking-[-0.48px] translate-y-[-50%] w-[138.5px]">
        <p className="adjustLetterSpacing block leading-[32px] text-[24px]">Payment</p>
      </div>
      
      {/* Payment Description */}
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-6 not-italic text-[#000000] text-[16px] text-left text-nowrap top-[258px] translate-y-[-50%]">
        <p className="block leading-[1.5] whitespace-pre text-[16px]">
          Enter your payment information
        </p>
      </div>
      
      {/* Form Fields */}
      <div className="absolute left-6 right-6 top-[286px]">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative w-full">
          
          {/* Credit Card Number */}
          <FormField label="Credit card number">
            <Input
              value={formData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="bg-[#ffffff] border border-neutral-200 rounded-lg px-4 py-3 w-full font-['Inter:Regular',_sans-serif] text-[16px] text-[#000000]"
            />
          </FormField>
          
          {/* Expiry Date and CCV Row */}
          <div className="flex flex-row gap-2 w-full">
            {/* Expiry Date */}
            <div className="flex-1">
              <FormField label="Expiry date">
                <Input
                  value={formData.expiryDate}
                  onChange={(e) => handleExpiryDateChange(e.target.value)}
                  placeholder="MM/YY"
                  className="bg-[#ffffff] border border-neutral-200 rounded-lg px-4 py-3 w-full font-['Inter:Regular',_sans-serif] text-[16px] text-[#000000]"
                />
              </FormField>
            </div>
            
            {/* CCV */}
            <div className="flex-1">
              <FormField label="CCV">
                <Input
                  value={formData.ccv}
                  onChange={(e) => handleCcvChange(e.target.value)}
                  placeholder="123"
                  className="bg-[#ffffff] border border-neutral-200 rounded-lg px-4 py-3 w-full font-['Inter:Regular',_sans-serif] text-[16px] text-[#000000]"
                />
              </FormField>
            </div>
          </div>
          
          {/* Billing Address Checkbox */}
          <div className="relative shrink-0 w-full mt-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.useBillingAddress}
                  onChange={(e) => updateFormField('useBillingAddress', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  formData.useBillingAddress 
                    ? 'bg-[#426b1f] border-[#426b1f]' 
                    : 'bg-white border-neutral-300'
                }`}>
                  {formData.useBillingAddress && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-3 font-['Inter:Regular',_sans-serif] text-[14px] text-[#000000] font-normal">
                Use my shipping address for billing
              </span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer 
        isFormValid={isFormValid}
        onProceedToConfirmation={onProceedToConfirmation}
      />
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative w-full">
        <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#757575] text-[14px] text-left tracking-[-0.14px] w-full">
          <p className="block leading-[24px]">{label}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProgressIndicators() {
  return (
    <>
      {/* Step 2 - Active */}
      <div className="absolute left-6 size-8 top-[174px]">
        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 32 32" className="block size-full">
          <circle cx="16" cy="16" fill="var(--fill-0, #426B1F)" r="16" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['Roboto:Regular',_sans-serif] font-normal text-[#ffffff] text-[16px] leading-none">2</span>
        </div>
      </div>
      
      {/* Step 3 - Inactive */}
      <div className="absolute size-8 top-[174px]" style={{ left: "calc(50% + 131.5px)" }}>
        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 32 32" className="block size-full">
          <circle cx="16" cy="16" fill="var(--fill-0, #757575)" r="16" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['Roboto:Regular',_sans-serif] font-normal text-[#ffffff] text-[16px] leading-none">3</span>
        </div>
      </div>
    </>
  );
}

function StatusBar() {
  return (
    <div className="absolute h-[47px] left-0 overflow-clip right-0 top-0">
      <Notch />
      <LeftSide />
      <RightSide />
    </div>
  );
}

function Notch() {
  return (
    <div
      className="absolute h-[33px] top-[-2px] translate-x-[-50%] w-[156px]"
      style={{ left: "calc(50% + 0.499992px)" }}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156 33">
        <g>
          <path d={svgPaths.p28770100} fill="black" />
          <path d={svgPaths.p28f48b80} fill="var(--fill-0, black)" />
          <path d={svgPaths.p14d82600} fill="var(--fill-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="absolute contents left-[25px] top-3.5">
      <div
        className="absolute h-[21px] rounded-3xl top-3.5 translate-x-[-50%] w-[54px]"
        style={{ left: "calc(50% - 135.5px)" }}
      >
        <div className="absolute css-a0byvc font-['SF_Pro_Display:Bold',_sans-serif] h-5 leading-[0] left-[27px] not-italic text-[#000000] text-[17px] text-center top-px tracking-[-0.408px] translate-x-[-50%] w-[54px]">
          <p className="adjustLetterSpacing block leading-[22px]">9:41</p>
        </div>
      </div>
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute contents left-[274px] top-[19px]">
      <div
        className="absolute h-[13px] top-[19px] translate-x-[-50%] w-[27.401px]"
        style={{ left: "calc(50% + 150.201px)" }}
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 13">
          <g>
            <path d={svgPaths.p3f827980} opacity="0.35" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p5fdc300} fill="var(--fill-0, black)" opacity="0.4" />
            <path d={svgPaths.pbee4a00} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-[32.269%] left-[80%] right-[15.467%] top-[42.553%]">
        <div className="absolute bottom-[-0.002%] left-0 right-0 top-[0.002%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 12">
            <path d={svgPaths.p17a4bf30} fill="var(--fill-0, black)" />
          </svg>
        </div>
      </div>
      <div
        className="absolute h-3 top-5 translate-x-[-50%] w-[18px]"
        style={{ left: "calc(50% + 95.5px)" }}
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
          <g>
            <path d={svgPaths.p1ec31400} fill="var(--fill-0, black)" />
            <path d={svgPaths.p19f8d480} fill="var(--fill-0, black)" />
            <path d={svgPaths.p13f4aa00} fill="var(--fill-0, black)" />
            <path d={svgPaths.p1bfb7500} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

interface HeaderProps {
  cartCount: number;
  onBack: () => void;
  onMenuClick: () => void;
}

function Header({ cartCount, onBack, onMenuClick }: HeaderProps) {
  return (
    <div className="absolute bg-[#ffffff] h-[149px] left-0 right-0 top-0">
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]" />
      
      {/* Mobile Nav */}
      <div className="absolute bg-[#ffffff] h-16 left-0 overflow-clip right-0 top-[31px]">
        <div className="absolute bg-[#ffffff] h-[66px] left-0 top-0 w-[393px]" />
        <div
          className="absolute flex flex-col font-['Newsreader:Medium',_sans-serif] font-medium justify-center leading-[0] text-[#426b1f] text-[24px] text-center text-nowrap top-9 tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%]"
          style={{ left: "calc(50% - 0.5px)" }}
        >
          <p className="adjustLetterSpacing block leading-none whitespace-pre text-[24px]">World Peas</p>
        </div>
        
        {/* Cart Icon */}
        <div className="absolute right-5 rounded-2xl size-8 top-[18px]">
          <div className="size-8">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g>
                <path d={svgPaths.p2003cd00} fill="var(--fill-0, black)" />
              </g>
            </svg>
          </div>
          {cartCount > 0 && (
            <div className="absolute bg-[#426b1f] left-[17px] rounded-lg size-4 top-[-1px]">
              <div className="flex flex-col items-center justify-center relative size-full">
                <div className="box-border content-stretch flex flex-col gap-2 items-center justify-center px-0.5 py-px relative size-4">
                  <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-center text-nowrap tracking-[-0.12px]">
                    <p className="adjustLetterSpacing block leading-none whitespace-pre">{cartCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Menu Icon */}
        <button 
          onClick={onMenuClick}
          className="absolute left-5 rounded-2xl size-8 top-[18px] flex items-center justify-center"
        >
          <div className="h-1.5 w-[18px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 8">
              <g>
                <line stroke="var(--stroke-0, black)" strokeWidth="1.5" x2="18" y1="1.25" y2="1.25" />
                <line stroke="var(--stroke-0, black)" strokeWidth="1.5" x2="18" y1="7.25" y2="7.25" />
              </g>
            </svg>
          </div>
        </button>
      </div>
      
      {/* Sub Nav */}
      <div className="absolute left-6 right-6 top-[103px]">
        <div className="box-border content-stretch flex flex-col gap-4 items-end justify-end p-0 relative w-full">
          <div className="relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row font-normal items-center justify-start leading-[0] p-0 relative text-left w-full">
              <div className="basis-0 flex flex-col font-['Newsreader:Regular',_sans-serif] grow justify-center min-h-px min-w-px relative shrink-0 text-[#000000] text-[24px] tracking-[-0.48px]">
                <p className="block leading-[32px] text-[24px]">Checkout</p>
              </div>
              <button 
                onClick={onBack}
                className="cursor-pointer flex items-center font-['Inter:Regular',_sans-serif] not-italic relative shrink-0 text-[#426b1f] text-[14px] text-nowrap tracking-[-0.14px]"
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="w-3 h-3">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                      <path d="M7.5 9L4.5 6L7.5 3" stroke="#426b1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">Back</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FooterProps {
  isFormValid: boolean;
  onProceedToConfirmation: () => void;
}

function Footer({ isFormValid, onProceedToConfirmation }: FooterProps) {
  return (
    <div className="absolute bg-[#ffffff] bottom-0 h-[144px] left-0 overflow-clip right-0 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      {/* Proceed to Confirmation Button */}
      <button
        onClick={isFormValid ? onProceedToConfirmation : undefined}
        disabled={!isFormValid}
        className={`absolute left-6 right-6 rounded-lg top-6 ${
          isFormValid ? 'bg-[#426b1f] cursor-pointer' : 'bg-neutral-200 cursor-not-allowed'
        }`}
      >
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-6 pr-4 py-2 relative w-full">
            <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left tracking-[-0.16px]">
              <p className="block leading-[24px]">Proceed to confirmation</p>
            </div>
            <div className="size-8 relative shrink-0">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <g>
                  <path d={svgPaths.p3d7c1f80} fill="var(--fill-0, white)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </button>
      
      {/* Informational Note */}
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-6 not-italic text-[#757575] text-[14px] text-left top-[94px] tracking-[-0.14px]">
        <p className="block leading-[24px]">Note: Your card won't be billed until confirmation</p>
      </div>
    </div>
  );
}