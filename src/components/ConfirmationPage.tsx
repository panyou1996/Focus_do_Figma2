import React from 'react';
import svgPaths from "../imports/svg-v7ovcq1vez";
import clsx from "clsx";

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  quantity: number;
}

interface ConfirmationPageProps {
  cartItems: CartItem[];
  cartCount: number;
  onBack: () => void;
  onMenuClick: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCompletePurchase: () => void;
}

export default function ConfirmationPage({
  cartItems,
  cartCount,
  onBack,
  onMenuClick,
  onUpdateQuantity,
  onCompletePurchase
}: ConfirmationPageProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
  const shipping = 0.00;
  const taxes = 0.75;
  const total = subtotal + shipping + taxes;

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
      
      {/* Confirmation Label */}
      <div className="absolute flex flex-col font-['Newsreader:Regular',_sans-serif] font-normal justify-center leading-[0] left-[72px] text-[#426b1f] text-[24px] text-left top-[190px] tracking-[-0.48px] translate-y-[-50%] w-[138.5px]">
        <p className="adjustLetterSpacing block leading-[32px] text-[24px]">Confirmation</p>
      </div>
      
      {/* Product List and Order Summary */}
      <div className="absolute left-6 top-[247px]">
        {/* Products */}
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative">
          {cartItems.map((item, index) => (
            <ProductItem 
              key={item.id} 
              item={item} 
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="mt-[34px]">
          {/* Subtotal */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#000000] text-[14px] text-left text-nowrap">
              <p className="block leading-[1.45] whitespace-pre">Subtotal</p>
            </div>
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#757575] text-[14px] text-nowrap text-right">
              <p className="block leading-[1.45] whitespace-pre">${subtotal.toFixed(2)}</p>
            </div>
          </div>
          
          {/* Shipping */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#000000] text-[14px] text-left text-nowrap">
              <p className="block leading-[1.45] whitespace-pre">Shipping</p>
            </div>
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#757575] text-[14px] text-nowrap text-right">
              <p className="block leading-[1.45] whitespace-pre">${shipping.toFixed(2)}</p>
            </div>
          </div>
          
          {/* Taxes */}
          <div className="flex justify-between items-center mb-[15px]">
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#000000] text-[14px] text-left text-nowrap">
              <p className="block leading-[1.45] whitespace-pre">Taxes</p>
            </div>
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#426b1f] text-[14px] text-nowrap text-right">
              <p className="block leading-[1.45] whitespace-pre">${taxes.toFixed(2)}</p>
            </div>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic text-[#000000] text-[18px] text-left text-nowrap">
              <p className="block leading-[1.45] whitespace-pre text-[18px] font-bold text-[18px]">Total</p>
            </div>
            <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic text-[#426b1f] text-[18px] text-nowrap text-right">
              <p className="block leading-[1.45] whitespace-pre text-[18px] font-bold text-[18px]">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer onCompletePurchase={onCompletePurchase} />
    </div>
  );
}

interface ProductItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

function ProductItem({ item, onUpdateQuantity }: ProductItemProps) {
  const totalPrice = (item.priceValue * item.quantity).toFixed(2);

  return (
    <div className="bg-[#ffffff] h-[88px] relative shrink-0 w-[327px]">
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      
      {/* Product Image */}
      <div
        className="absolute bg-[50%_50%] bg-cover bg-no-repeat left-0 rounded size-[72px] top-0"
        style={{ backgroundImage: `url('${item.image}')` }}
      />
      
      {/* Product Name and Price */}
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[86px] not-italic text-[#000000] text-[14px] text-left top-4 translate-y-[-50%] w-[173px]">
        <p className="leading-[16px]">
          <span className="text-[#000000]">{item.name}</span>
          <span>
            <br />
          </span>
          <span className="text-[#426b1f]">{item.price}</span>
        </p>
      </div>
      
      {/* Quantity Display */}
      <div className="absolute bg-[#ffffff] left-[86px] rounded-lg top-11">
        <div className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-lg" />
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-2 py-1 relative">
            <div className="relative shrink-0">
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative">
                <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                  <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                    {item.quantity}
                  </p>
                </div>
                <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[7px]">
                  <div className="flex-none rotate-[90deg]">
                    <div className="h-[7px] relative w-[3.5px]">
                      <div className="absolute bottom-[-5.051%] left-[-10.101%] right-[-20.203%] top-[-5.051%]">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 6 9"
                        >
                          <path
                            d="M1 1L4.5 4.5L1 8"
                            stroke="var(--stroke-0, black)"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total Price */}
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic right-0 text-[#757575] text-[14px] text-nowrap text-right top-[58px] translate-y-[-50%]">
        <p className="block leading-[16px] whitespace-pre">${totalPrice}</p>
      </div>
    </div>
  );
}

function ProgressIndicators() {
  return (
    <>
      {/* Step 3 - Active */}
      <div className="absolute left-6 size-8 top-[174px]">
        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 32 32" className="block size-full">
          <circle cx="16" cy="16" fill="var(--fill-0, #426B1F)" r="16" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['Roboto:Regular',_sans-serif] font-normal text-[#ffffff] text-[16px] leading-none">3</span>
        </div>
      </div>
    </>
  );
}

interface FooterProps {
  onCompletePurchase: () => void;
}

function Footer({ onCompletePurchase }: FooterProps) {
  return (
    <div className="absolute bg-[#ffffff] bottom-0 h-[124px] left-0 overflow-clip right-0 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      {/* Complete Purchase Button */}
      <button
        onClick={onCompletePurchase}
        className="absolute bg-[#426b1f] left-6 right-6 rounded-lg top-6"
      >
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-6 pr-4 py-2 relative w-full">
            <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left tracking-[-0.16px]">
              <p className="block leading-[24px]">Complete purchase</p>
            </div>
            <div className="relative shrink-0 size-8">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 32 32"
              >
                <g>
                  <path d={svgPaths.p3d7c1f80} fill="var(--fill-0, white)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </button>
      
      {/* Hidden Note (opacity set to nearly invisible as in design) */}
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-6 not-italic opacity-[0.001] text-[#426b1f] text-[14px] text-left text-nowrap top-[94px] tracking-[-0.14px] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">
          <span className="font-['Inter:Bold',_sans-serif] font-bold not-italic text-[#426b1f]">Note: </span>
          <span className="adjustLetterSpacing text-[#757575]">Your card won't be billed until confirmation</span>
        </p>
      </div>
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
                    <p className="adjustLetterSpacing block leading-none whitespace-pre text-[9px]">{cartCount}</p>
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