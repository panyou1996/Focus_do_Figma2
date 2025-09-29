import React from 'react';
import svgPaths from "../imports/svg-ixc5uwmuox";
import QuantityDropdown from './QuantityDropdown';
import IconForward from '../imports/IconForward-2013-176';

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  quantity: number;
}

interface BasketPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onMenuClick: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onGoToCheckout?: () => void;
}

export default function BasketPage({ 
  cartItems, 
  onBack, 
  onMenuClick, 
  onUpdateQuantity,
  onGoToCheckout 
}: BasketPageProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);

  const isEmpty = cartItems.length === 0;

  return (
    <div className="bg-[#ffffff] relative size-full">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <Header 
        cartCount={totalItems}
        onBack={onBack}
        onMenuClick={onMenuClick}
      />
      
      {isEmpty ? (
        /* Empty State */
        <EmptyBasket onReturnToShop={onBack} />
      ) : (
        <>
          {/* Scrollable Content Area */}
          <div className="absolute left-0 right-0 top-[149px] bottom-[124px] overflow-y-auto">
            <div className="px-6 pt-[38px]">
              {/* Product List */}
              <div className="flex flex-col gap-4 mb-6">
                {cartItems.map((item) => (
                  <ProductItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))}
              </div>
              
              {/* Subtotal - 24px below the last product card */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#000000] text-[18px] text-left text-nowrap">
                  <p className="block leading-[1.45] whitespace-pre text-[18px]">Subtotal</p>
                </div>
                <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#426b1f] text-[18px] text-nowrap text-right">
                  <p className="block leading-[1.45] whitespace-pre text-[18px]">${subtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <Footer onGoToCheckout={onGoToCheckout} />
        </>
      )}
    </div>
  );
}

interface EmptyBasketProps {
  onReturnToShop: () => void;
}

function EmptyBasket({ onReturnToShop }: EmptyBasketProps) {
  return (
    <div className="absolute bg-neutral-200 left-[33px] rounded-3xl top-[194px] w-[327px]">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-6 relative w-[327px]">
          <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[24px] text-left w-full">
            <p className="block leading-[1.25]">Your cart is empty!</p>
          </div>
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left w-full">
            <p className="block leading-[1.5]">
              Head back to the products page to check out our produce 🌸
            </p>
          </div>
          <button 
            onClick={onReturnToShop}
            className="bg-[#426b1f] relative rounded-[360px] shrink-0 w-full"
          >
            <div className="flex flex-row items-center justify-center relative size-full">
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2 relative w-full">
                <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-left text-nowrap tracking-[-0.18px]">
                  <p className="adjustLetterSpacing block leading-[32px] whitespace-pre">
                    Return to shop
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>
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
                <p className="block leading-[32px] text-[24px]">My Basket</p>
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

interface ProductItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

function ProductItem({ item, onUpdateQuantity }: ProductItemProps) {
  const totalPrice = (item.priceValue * item.quantity).toFixed(2);

  const handleQuantityChange = (quantity: number) => {
    onUpdateQuantity(item.id, quantity);
  };

  return (
    <div className="bg-[#ffffff] h-[88px] relative shrink-0 w-full">
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
      
      {/* Quantity Dropdown */}
      <div className="absolute left-[86px] top-11">
        <QuantityDropdown
          quantity={item.quantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
      
      {/* Total Price */}
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic right-0 text-[#757575] text-[14px] text-nowrap text-right top-[58px] translate-y-[-50%]">
        <p className="block leading-[16px] whitespace-pre text-[16px]">${totalPrice}</p>
      </div>
    </div>
  );
}

interface FooterProps {
  onGoToCheckout?: () => void;
}

function Footer({ onGoToCheckout }: FooterProps) {
  return (
    <div className="absolute bg-[#ffffff] bottom-0 h-[124px] left-0 overflow-clip right-0 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-6 not-italic text-[#426b1f] text-[14px] text-left text-nowrap top-[94px] tracking-[-0.14px] translate-y-[-50%]">
        <p className="leading-[24px] whitespace-pre">
          <span className="font-['Inter:Bold',_sans-serif] font-bold not-italic text-[#426b1f]">Hooray! </span>
          <span className="adjustLetterSpacing text-[#757575]">You qualify for free shipping</span>
        </p>
      </div>
      
      {/* Proceed to Checkout Button */}
      <button 
        onClick={onGoToCheckout}
        className="absolute bg-[#426b1f] left-6 right-6 rounded-lg top-6"
      >
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-6 pr-4 py-2 relative w-full">
            <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left tracking-[-0.16px]">
              <p className="block leading-[24px] text-[16px]">Proceed to checkout</p>
            </div>
            <div className="size-8 relative shrink-0">
              <IconForward />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}