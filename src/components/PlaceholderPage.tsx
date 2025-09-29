import React from 'react';
import StatusBar from './shared/StatusBar';
import svgPaths from "../imports/svg-s5y93igtx2";

interface PlaceholderPageProps {
  title: string;
  onBack: () => void;
  onMenuClick: () => void;
  cartCount: number;
}

export default function PlaceholderPage({ title, onBack, onMenuClick, cartCount }: PlaceholderPageProps) {
  return (
    <div className="bg-[#ffffff] relative size-full">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <div className="absolute bg-[#ffffff] h-[149px] left-0 right-0 top-0">
        <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]" />
        
        {/* Mobile Nav */}
        <div className="absolute bg-[#ffffff] h-16 left-0 overflow-clip right-0 top-[31px]">
          <div className="absolute bg-[#ffffff] h-[66px] left-0 top-0 w-[393px]" />
          <div
            className="absolute css-v5bt0j flex flex-col font-['Newsreader:Medium',_sans-serif] font-medium justify-center leading-[0] text-[#426b1f] text-[24px] text-center text-nowrap top-9 tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%]"
            style={{ left: "calc(50% - 0.5px)" }}
          >
            <p className="adjustLetterSpacing block leading-none whitespace-pre">World Peas</p>
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
                    <div className="css-78fix6 flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-center text-nowrap tracking-[-0.12px]">
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
                <div className="basis-0 css-ip39ex flex flex-col font-['Newsreader:Regular',_sans-serif] grow justify-center min-h-px min-w-px relative shrink-0 text-[#000000] text-[24px] tracking-[-0.48px]">
                  <p className="block leading-[32px]">{title}</p>
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
      
      {/* Content */}
      <div className="absolute left-0 right-0 top-[225px] bottom-4 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-[24px] font-['Newsreader:Regular',_sans-serif] text-[#426b1f] mb-4">{title}</h2>
          <p className="text-[16px] font-['Inter:Regular',_sans-serif] text-[#757575]">
            This screen is coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}