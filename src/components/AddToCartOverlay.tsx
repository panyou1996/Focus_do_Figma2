import React from 'react';
import { motion } from 'motion/react';

interface Product {
  id: number;
  name: string;
  image: string;
}

interface AddToCartOverlayProps {
  isVisible: boolean;
  product: Product | null;
  quantity: number;
}

export default function AddToCartOverlay({ isVisible, product, quantity }: AddToCartOverlayProps) {
  if (!product) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isVisible ? "0%" : "100%" }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 400,
        mass: 0.8
      }}
      className="absolute bottom-0 left-0 right-0 h-[121px] z-50"
    >
      <div className="bg-[#426b1f] relative rounded-tl-[8px] rounded-tr-[8px] size-full">
        <div className="absolute bg-[#426b1f] h-[39px] left-0 top-[82px] w-[393px]" />
        
        {/* Background Illustration */}
        <BgIllustration />
        
        {/* Product Name */}
        <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[88px] not-italic text-[#ffffff] text-[18px] text-left text-nowrap top-[50px] translate-y-[-50%]">
          <p className="block leading-[16px] whitespace-pre">{product.name}</p>
        </div>
        
        {/* "Adding to basket:" label */}
        <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[88px] not-italic opacity-50 text-[#ffffff] text-[16px] text-left text-nowrap top-[30px] translate-y-[-50%]">
          <p className="block leading-[16px] whitespace-pre">Adding to basket:</p>
        </div>
        
        {/* Quantity Input */}
        <QuantityInput quantity={quantity} />
        
        {/* Product Image */}
        <div
          className="absolute bg-[#d9d9d9] left-6 rounded size-12 top-4"
          style={{
            backgroundImage: `url('${product.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded" />
        </div>
      </div>
    </motion.div>
  );
}

function BgIllustration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Simple decorative background pattern */}
      <div className="absolute right-4 top-4 opacity-20">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
          <circle cx="20" cy="20" r="8" fill="rgba(255,255,255,0.3)" />
          <circle cx="40" cy="10" r="6" fill="rgba(255,255,255,0.2)" />
          <circle cx="60" cy="25" r="10" fill="rgba(255,255,255,0.1)" />
          <circle cx="70" cy="5" r="4" fill="rgba(255,255,255,0.25)" />
        </svg>
      </div>
    </div>
  );
}

function QuantityInput({ quantity }: { quantity: number }) {
  return (
    <div className="absolute bg-[#ffffff] right-6 rounded-lg top-4">
      <div className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-4 py-3 relative">
          <div className="relative shrink-0">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative">
              <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.16px]">
                <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">{quantity}</p>
              </div>
              <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[7px]">
                <div className="flex-none rotate-[90deg]">
                  <div className="h-[7px] relative w-[3.5px]">
                    <div className="absolute bottom-[-5.051%] left-[-10.101%] right-[-20.203%] top-[-5.051%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 9">
                        <path d="M1 1L4.5 4.5L1 8" stroke="var(--stroke-0, black)" />
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
  );
}