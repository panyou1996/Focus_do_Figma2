import React from 'react';
import StatusBar from './shared/StatusBar';
import svgPaths from "../imports/svg-s5y93igtx2";
import clsx from "clsx";
import { Input } from './ui/input';

interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  farm: string;
  images: string[];
  isFavorite: boolean;
  description: string;
  location: string;
  dietary: string[];
}

type SortOption = 'default' | 'a-z' | 'price';

interface ProductListPageProps {
  products: Product[];
  favorites: Set<number>;
  searchTerm: string;
  sortOption: SortOption;
  cartCount: number;
  onSearchChange: (term: string) => void;
  onSortChange: (option: SortOption) => void;
  onToggleFavorite: (productId: number) => void;
  onAddToCart: (productId: number) => void;
  onProductClick: (product: Product) => void;
  onMenuClick: () => void;
  onCartClick: () => void;
}

export default function ProductListPage({
  products,
  favorites,
  searchTerm,
  sortOption,
  cartCount,
  onSearchChange,
  onSortChange,
  onToggleFavorite,
  onAddToCart,
  onProductClick,
  onMenuClick,
  onCartClick
}: ProductListPageProps) {
  return (
    <div className="bg-[#ffffff] relative size-full">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Header */}
      <Header 
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortOption={sortOption}
        onSortChange={onSortChange}
        onMenuClick={onMenuClick}
        onCartClick={onCartClick}
      />
      
      {/* Content */}
      <Content 
        products={products}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
      />
    </div>
  );
}

interface HeaderProps {
  cartCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onMenuClick: () => void;
  onCartClick: () => void;
}

function Header({ cartCount, searchTerm, onSearchChange, sortOption, onSortChange, onMenuClick, onCartClick }: HeaderProps) {
  return (
    <div className="absolute bg-[#ffffff] h-[201px] left-0 right-0 top-0">
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]" />
      
      {/* Mobile Nav */}
      <div className="absolute bg-[#ffffff] h-16 left-0 overflow-clip right-0 top-[31px]">
        <div className="absolute bg-[#ffffff] h-[66px] left-0 top-0 w-[393px]" />
        <div
          className="absolute css-v5bt0j flex flex-col font-['Newsreader:Medium',_sans-serif] font-medium justify-center leading-[0] text-[#426b1f] text-[24px] text-center text-nowrap top-9 tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%]"
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
                  <div className="css-78fix6 flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-center text-nowrap tracking-[-0.12px]">
                    <p className="adjustLetterSpacing block leading-none whitespace-pre">{cartCount}</p>
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
      <div className="absolute left-6 right-4 top-[103px]">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative w-full">
          {/* Breadcrumb and Search */}
          <div className="relative shrink-0 w-full">
            <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative w-full">
              <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
                <div className="box-border content-stretch flex flex-row font-['Newsreader:Regular',_sans-serif] font-normal gap-0.5 items-start justify-start leading-[0] p-0 relative text-[24px] text-left text-nowrap tracking-[-0.48px] w-full">
                  <div className="css-eomsl1 flex flex-col justify-center relative shrink-0 text-[#757575]">
                    <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre text-[24px]">All Aisles</p>
                  </div>
                  <div className="css-eomsl1 flex flex-col justify-center relative shrink-0 text-[#757575]">
                    <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre text-[24px]">/</p>
                  </div>
                  <div className="css-ip39ex flex flex-col justify-center relative shrink-0 text-[#000000]">
                    <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre text-[24px]">Produce</p>
                  </div>
                </div>
              </div>
              <div className="size-8 relative shrink-0">
                <Input
                  placeholder="Search produce..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="absolute right-0 top-0 w-8 h-8 p-0 border-0 bg-transparent text-transparent placeholder:text-transparent focus:w-[200px] focus:text-black focus:placeholder:text-gray-400 transition-all duration-200 ease-in-out focus:bg-white focus:border focus:border-gray-200 focus:rounded-md focus:px-3"
                />
                <svg className="absolute inset-0 size-8 pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                  <g>
                    <path d={svgPaths.p14ffce80} fill="var(--fill-0, black)" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="relative shrink-0">
            <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative">
              <button
                onClick={() => onSortChange('default')}
                className={clsx(
                  "relative rounded-xl shrink-0",
                  sortOption === 'default' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative">
                  <div className={clsx(
                    "css-79j43w flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.14px]",
                    sortOption === 'default' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">Default</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => onSortChange('a-z')}
                className={clsx(
                  "relative rounded-xl shrink-0",
                  sortOption === 'a-z' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative">
                  <div className={clsx(
                    "css-k6fayy flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.14px]",
                    sortOption === 'a-z' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">A-Z</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => onSortChange('price')}
                className={clsx(
                  "relative rounded-xl shrink-0",
                  sortOption === 'price' ? "bg-[#426b1f]" : "border border-[#e1e1e1] border-solid"
                )}
              >
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative">
                  <div className={clsx(
                    "css-k6fayy flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.14px]",
                    sortOption === 'price' ? "text-[#ffffff]" : "text-[#000000]"
                  )}>
                    <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">{`$ -> $$`}</p>
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

interface ContentProps {
  products: Product[];
  favorites: Set<number>;
  onToggleFavorite: (productId: number) => void;
  onAddToCart: (productId: number) => void;
  onProductClick: (product: Product) => void;
}

function Content({ products, favorites, onToggleFavorite, onAddToCart, onProductClick }: ContentProps) {
  return (
    <div className="absolute left-0 right-0 top-[225px] bottom-4 overflow-y-auto">
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start relative w-full px-6 py-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.has(product.id)}
            onToggleFavorite={() => onToggleFavorite(product.id)}
            onAddToCart={() => onAddToCart(product.id)}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onClick: () => void;
}

function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart, onClick }: ProductCardProps) {
  return (
    <div className="bg-[#ffffff] relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] shrink-0 w-full rounded-[12px]">
      <div className="box-border content-stretch flex flex-row items-start justify-start overflow-clip p-0 relative w-full">
        {/* Product Image */}
        <div
          className="bg-[#ffffff] relative self-stretch shrink-0 w-[93px] cursor-pointer rounded-l-[12px]"
          style={{
            backgroundImage: `url('${product.images[0]}')${product.images[1] ? `, url('${product.images[1]}')` : ''}`,
            backgroundSize: 'cover'
          }}
          onClick={onClick}
        >
          <div className="absolute border-[px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
        </div>
        
        {/* Product Info */}
        <div className="basis-0 grow min-h-px min-w-px relative self-stretch shrink-0 cursor-pointer" onClick={onClick}>
          <div className="flex flex-col justify-center relative size-full">
            <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center pl-4 pr-8 py-4 relative size-full">
              <div className="relative shrink-0 w-full">
                <div className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-2 items-start justify-start leading-[0] not-italic p-0 relative text-left w-full">
                  <div className="css-w9luqw flex flex-col justify-center relative shrink-0 text-[#000000] text-[0px] w-[173px]">
                    <p className="leading-[16px] text-[14px]">
                      {product.name}
                      <br />
                      <span className="text-[#426b1f]">{product.price}</span>
                    </p>
                  </div>
                  <div className="css-415rgs relative shrink-0 text-[#757575] text-[12px] text-nowrap">
                    <p className="block leading-[1.6] whitespace-pre text-[12px]">{product.farm} →</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute right-2 top-2 size-8"
        >
          <HeartIcon filled={isFavorite} />
        </button>
        
        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="absolute bg-[#426b1f] bottom-2 right-2 rounded-lg size-8 flex items-center justify-center"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <div className="size-8">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g>
          {filled ? (
            <>
              <path
                d={svgPaths.p297cea80}
                fill="var(--fill-0, #FF8577)"
                fillOpacity="0.98"
              />
              <path
                d={svgPaths.p3bfbe380}
                fill="var(--fill-0, #FF8577)"
                fillOpacity="0.98"
              />
            </>
          ) : (
            <>
              <path
                d={svgPaths.p1177b300}
                stroke="var(--stroke-0, black)"
              />
              <path
                d={svgPaths.p1d24580}
                fill="var(--fill-0, #FF8577)"
                fillOpacity="0.98"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="size-8">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g>
          <path d={svgPaths.p367b3d00} fill="var(--fill-0, white)" />
        </g>
      </svg>
    </div>
  );
}