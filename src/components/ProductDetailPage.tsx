import React, { useState } from 'react';
import svgPaths from "../imports/svg-42raqsyfh4";
import footerSvgPaths from "../imports/svg-ved004mhkj";
import clsx from "clsx";

interface ProductDetailPageProps {
  product: {
    id: number;
    name: string;
    price: string;
    priceValue: number;
    farm: string;
    images: string[];
    description: string;
    location: string;
    dietary: string[];
  };
  cartCount: number;
  onBack: () => void;
  onAddToCart: (quantity: number) => void;
  onMenuClick: () => void;
  onCartClick: () => void;
}

export default function ProductDetailPage({
  product,
  cartCount,
  onBack,
  onAddToCart,
  onMenuClick,
  onCartClick
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  const handleQuantitySelect = (newQuantity: number) => {
    setQuantity(newQuantity);
    setShowQuantityDropdown(false);
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
        onCartClick={onCartClick}
        productName={product.name}
      />
      
      {/* Product Images */}
      <div className="absolute left-0 right-0 top-[149px] h-[300px]">
        <div 
          className="w-full h-full bg-cover bg-center relative"
          style={{ backgroundImage: `url('${product.images[currentImageIndex]}')` }}
        >
          {/* Image Navigation Dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={clsx(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Product Details */}
      <div className="absolute left-0 right-0 top-[449px] bottom-[100px] overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Product Info */}
          <div>
            <p className="text-[18px] font-['Inter:Regular',_sans-serif] text-[#426b1f] mb-2">
              {product.price}
            </p>
            <p className="text-[14px] font-['Inter:Regular',_sans-serif] text-[#757575]">
              {product.farm} →
            </p>
          </div>
          
          {/* Description */}
          <div>
            <p className="text-[16px] font-['Inter:Regular',_sans-serif] text-[#000000] leading-[24px] mb-4">
              {product.description}
            </p>
            <p className="text-[16px] font-['Inter:Regular',_sans-serif] text-[#757575] leading-[20px]">
              {product.location}
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-[#ffffff] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] absolute bottom-0 left-0 right-0 h-[100px]">
        <div className="absolute left-6 right-6 top-6">
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative w-full">
            {/* Quantity Input */}
            <div className="bg-[#ffffff] relative rounded-lg shrink-0 w-[58px]">
              <div className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-lg" />
              <div className="relative size-full">
                <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-4 py-3 relative w-[58px]">
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
                      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative"
                    >
                      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.16px]">
                        <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
                          {quantity}
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
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Dropdown Menu */}
              {showQuantityDropdown && (
                <div className="absolute bottom-full left-0 right-0 bg-white border border-neutral-200 rounded-lg mb-1 max-h-48 overflow-y-auto z-50">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleQuantitySelect(num)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 font-['Inter:Regular',_sans-serif] text-[14px] text-[#000000] font-normal"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Add to Basket Button */}
            <div className="basis-0 bg-[#426b1f] grow min-h-px min-w-px relative rounded-lg shrink-0">
              <button
                onClick={handleAddToCart}
                className="flex flex-row items-center relative size-full"
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-6 pr-4 py-2 relative w-full">
                  <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left tracking-[-0.16px]">
                    <p className="block leading-[24px] text-[14px]">Add to basket</p>
                  </div>
                  <div className="relative shrink-0 size-8">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 32 32"
                    >
                      <path d={footerSvgPaths.p367b3d00} fill="var(--fill-0, white)" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
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
    <div className="absolute contents left-[283px] top-[19px]">
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
  onCartClick: () => void;
  productName: string;
}

function Header({ cartCount, onBack, onMenuClick, onCartClick, productName }: HeaderProps) {
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
        <button 
          onClick={onCartClick}
          className="absolute right-5 rounded-2xl size-8 top-[18px] cursor-pointer"
        >
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
        </button>
        
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
                <h1 className="block leading-[32px] text-[24px]">{productName}</h1>
              </div>
              <button 
                onClick={onBack}
                className="cursor-pointer flex flex-row items-center gap-1 font-['Inter:Regular',_sans-serif] justify-center not-italic relative shrink-0 text-[#426b1f] text-[14px] text-nowrap tracking-[-0.14px]"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <path d="M7.5 2.5L4 6L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="adjustLetterSpacing leading-[24px]">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}