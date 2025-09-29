import React, { useState } from 'react';

interface QuantityDropdownProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantityDropdown({ quantity, onQuantityChange }: QuantityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantitySelect = (newQuantity: number) => {
    onQuantityChange(newQuantity);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-[60px]">
      {/* Dropdown Trigger */}
      <button
        onClick={toggleDropdown}
        className="bg-[#ffffff] w-[60px] rounded-lg relative z-20"
      >
        <div className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-lg" />
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-2 py-1 relative">
            <div className="relative shrink-0">
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative">
                <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                  <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">{quantity}</p>
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
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-[60px] bg-[#ffffff] rounded-bl-[4px] rounded-br-[4px] shadow-[0px_4px_4px_0px_rgba(26,26,26,0.25)]">
          <div className="absolute inset-0 pointer-events-none shadow-[-2px_0px_0px_0px_inset_#6b6b6b,0px_-2px_0px_0px_inset_#6b6b6b,2px_0px_0px_0px_inset_#6b6b6b]" />
          <div className="relative size-full">
            <div className="box-border content-stretch flex flex-col items-start justify-start px-0 py-2 relative size-full max-h-[200px] overflow-y-auto">
              {Array.from({ length: 11 }, (_, i) => (
                <MenuItem
                  key={i}
                  value={i}
                  isSelected={i === quantity}
                  onSelect={() => handleQuantitySelect(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

interface MenuItemProps {
  value: number;
  isSelected: boolean;
  onSelect: () => void;
}

function MenuItem({ value, isSelected, onSelect }: MenuItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative shrink-0 w-full hover:bg-gray-100 ${isSelected ? 'bg-gray-50' : ''}`}
    >
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-4 py-2 relative w-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-left text-nowrap">
            <p className="block leading-[1.5] whitespace-pre">{value}</p>
          </div>
        </div>
      </div>
    </button>
  );
}