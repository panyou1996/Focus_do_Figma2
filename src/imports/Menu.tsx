import imgRectangle6537 from "figma:asset/73a0a2712c55c814e558e14ad018e308fab9b18c.png";

function Frame7() {
  return (
    <div className="relative shrink-0">
      <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative">
        <div className="flex flex-col font-['Newsreader:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[36px] text-left text-nowrap tracking-[-0.72px]">
          <p className="adjustLetterSpacing block leading-[40px] whitespace-pre">
            Basket
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute left-6 top-[135px]">
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative">
        <div className="flex flex-col font-['Newsreader:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[36px] text-left text-nowrap tracking-[-0.72px]">
          <p className="adjustLetterSpacing block leading-[40px] whitespace-pre">
            Shop
          </p>
        </div>
        <div className="flex flex-col font-['Newsreader:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[36px] text-left text-nowrap tracking-[-0.72px]">
          <p className="adjustLetterSpacing block leading-[40px] whitespace-pre">
            Newsstand
          </p>
        </div>
        <div className="flex flex-col font-['Newsreader:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[36px] text-left text-nowrap tracking-[-0.72px]">
          <p className="adjustLetterSpacing block leading-[40px] whitespace-pre">
            Who we are
          </p>
        </div>
        <div className="flex flex-col font-['Newsreader:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[36px] text-left text-nowrap tracking-[-0.72px]">
          <p className="adjustLetterSpacing block leading-[40px] whitespace-pre">
            My Profile
          </p>
        </div>
        <Frame7 />
      </div>
    </div>
  );
}

function MaskGroup() {
  return (
    <div
      className="absolute contents left-[43px] top-[481px]"
      data-name="Mask group"
    >
      <div className="absolute flex h-[570.679px] items-center justify-center left-[5.046px] top-[448.465px] w-[591.749px]">
        <div className="flex-none rotate-[35.253deg]">
          <div
            className="bg-[#9ec979] h-[372.717px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[37.9541px_32.535px] mask-size-[522.726px_504.413px] w-[461.343px]"
            style={{ maskImage: `url('${imgRectangle6537}')` }}
          />
        </div>
      </div>
    </div>
  );
}

function Hamburger() {
  return (
    <div
      className="absolute h-[12.728px] left-2.5 top-2.5 w-[12.864px]"
      data-name="Hamburger"
    >
      <div className="absolute bottom-[-4.167%] left-[-4.123%] right-[-4.123%] top-[-4.167%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 15 15"
        >
          <g id="Hamburger">
            <path
              d="M1 1.00003L13.7279 13.7279"
              id="Line 3"
              stroke="var(--stroke-0, white)"
              strokeWidth="1.5"
            />
            <path
              d="M1.13605 13.7279L13.864 1"
              id="Line 4"
              stroke="var(--stroke-0, white)"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <button
      className="absolute block cursor-pointer left-[19px] overflow-visible rounded-2xl size-8 top-[49px]"
      data-name="Menu Icon"
    >
      <Hamburger />
    </button>
  );
}

export default function Menu() {
  return (
    <div className="bg-[#426b1f] relative size-full" data-name="Menu">
      <Frame6 />
      <MaskGroup />
      <MenuIcon />
    </div>
  );
}