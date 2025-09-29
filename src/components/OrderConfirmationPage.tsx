import React from 'react';
import svgPaths from "../imports/svg-x4vilrsbuo";

interface OrderConfirmationPageProps {
  cartCount: number;
  customerInfo: CustomerInfo;
  onShop: () => void;
  onMenuClick: () => void;
}

interface CustomerInfo {
  fullName: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
}

export default function OrderConfirmationPage({ cartCount, customerInfo, onShop, onMenuClick }: OrderConfirmationPageProps) {
  // Generate estimated delivery date (3-5 business days from now)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 4); // 4 days from now
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format address for display
  const formatAddress = () => {
    const addressParts = [
      customerInfo.fullName,
      customerInfo.address,
      customerInfo.city,
      customerInfo.state && customerInfo.country === 'United States' ? `${customerInfo.state}, ${customerInfo.zipCode}` : customerInfo.zipCode,
      customerInfo.country
    ].filter(part => part && part.trim() !== '');

    return addressParts;
  };

  const formattedAddress = formatAddress();
  const estimatedDelivery = getEstimatedDelivery();

  return (
    <div className="bg-[#ffffff] relative size-full">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <Header 
        cartCount={cartCount}
        onMenuClick={onMenuClick}
      />
      
      {/* Content */}
      <div className="absolute left-6 right-6 top-[149px] bottom-[124px] overflow-y-auto">
        <div className="py-6 space-y-6">
          
          {/* Order Confirmation Message */}
          <div className="text-center space-y-4">
            <div className="size-16 mx-auto bg-[#426b1f] rounded-full flex items-center justify-center">
              <svg className="size-8" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <path d="M9 16L14 21L23 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-['Newsreader:Regular',_sans-serif] text-[24px] text-[#000000] tracking-[-0.48px] leading-[32px] mb-2">
                Order confirmed!
              </h1>
              <p className="font-['Inter:Regular',_sans-serif] text-[16px] text-[#757575] tracking-[-0.16px] leading-[24px]">
                Your order is being prepared and will be shipped soon.
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-[#f8f9fa] rounded-lg p-4 space-y-4">
            <h2 className="font-['Inter:Medium',_sans-serif] text-[18px] text-[#000000] tracking-[-0.18px] leading-[24px]">
              Order Details
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Delivery To */}
              <div>
                <h3 className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#757575] tracking-[-0.14px] leading-[24px] mb-2">
                  Delivery to
                </h3>
                <div className="space-y-1">
                  {formattedAddress.map((line, index) => (
                    <p key={index} className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#000000] tracking-[-0.14px] leading-[24px]">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Estimated Delivery */}
              <div>
                <h3 className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#757575] tracking-[-0.14px] leading-[24px] mb-2">
                  Estimated delivery
                </h3>
                <p className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#000000] tracking-[-0.14px] leading-[24px]">
                  {estimatedDelivery}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#f8f9fa] rounded-lg p-4 space-y-3">
            <h3 className="font-['Inter:Medium',_sans-serif] text-[16px] text-[#000000] tracking-[-0.16px] leading-[24px]">
              What happens next?
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="size-2 bg-[#426b1f] rounded-full mt-2.5 flex-shrink-0"></div>
                <p className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#000000] tracking-[-0.14px] leading-[20px]">
                  We'll prepare your fresh produce order
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-2 bg-[#e5e5e5] rounded-full mt-2.5 flex-shrink-0"></div>
                <p className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#757575] tracking-[-0.14px] leading-[20px]">
                  Your order will be packed and shipped
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-2 bg-[#e5e5e5] rounded-full mt-2.5 flex-shrink-0"></div>
                <p className="font-['Inter:Regular',_sans-serif] text-[14px] text-[#757575] tracking-[-0.14px] leading-[20px]">
                  Delivered fresh to your door by {estimatedDelivery}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer onShop={onShop} />
    </div>
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
  onMenuClick: () => void;
}

function Header({ cartCount, onMenuClick }: HeaderProps) {
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
        <div className="box-border content-stretch flex flex-col gap-4 items-center justify-center p-0 relative w-full">
          <div className="relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row font-normal items-center justify-center leading-[0] p-0 relative text-center w-full">
              <div className="flex flex-col font-['Newsreader:Regular',_sans-serif] justify-center relative text-[#000000] text-[24px] tracking-[-0.48px]">
                <p className="block leading-[32px] text-[24px]">Order Confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FooterProps {
  onShop: () => void;
}

function Footer({ onShop }: FooterProps) {
  return (
    <div className="absolute bg-[#ffffff] bottom-0 h-[124px] left-0 overflow-clip right-0 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      {/* Continue Shopping Button */}
      <button
        onClick={onShop}
        className="absolute left-6 right-6 rounded-lg top-6 bg-[#426b1f] cursor-pointer"
      >
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center pl-6 pr-6 py-2 relative w-full">
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative text-[#ffffff] text-[16px] text-center tracking-[-0.16px]">
              <p className="block leading-[24px]">Continue shopping</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}