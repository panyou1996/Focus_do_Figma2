import svgPaths from "./svg-42raqsyfh4";
import clsx from "clsx";
import imgTomato from "figma:asset/c7319cef2b86a8f71b6765b77a10caccb7fc8b83.png";
type NotchNotchBackgroundImageProps = {
  additionalClassNames?: string[];
};

function NotchNotchBackgroundImage({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<NotchNotchBackgroundImageProps>) {
  return (
    <div
      style={{ left: "calc(50% + 0.499992px)" }}
      className={clsx(
        "absolute top-[-2px] translate-x-[-50%]",
        additionalClassNames,
      )}
    >
      {children}
    </div>
  );
}
type Frame21BackgroundImageProps = {
  additionalClassNames?: string[];
};

function Frame21BackgroundImage({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<Frame21BackgroundImageProps>) {
  return (
    <p className={clsx("leading-[1.5]", additionalClassNames)}>{children}</p>
  );
}
type BackgroundImage40Props = {
  additionalClassNames?: string[];
};

function BackgroundImage40({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImage40Props>) {
  return (
    <div className={clsx("size-8", additionalClassNames)}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        {children}
      </svg>
    </div>
  );
}

function BackgroundImage25({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-10">
      <div className="absolute inset-[-5%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 44 44"
        >
          {children}
        </svg>
      </div>
    </div>
  );
}
type BackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string[];
};

function BackgroundImageAndText({
  text,
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImageAndTextProps>) {
  return (
    <div
      className={clsx(
        "[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid mt-0 place-items-start relative",
        additionalClassNames,
      )}
    >
      <BackgroundImage25>{children}</BackgroundImage25>
      <div className="[grid-area:1_/_1] css-wlbibp flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] ml-5 mt-[20.357px] not-italic relative text-[#1b1b1b] text-[12px] text-center text-nowrap tracking-[0.12px] translate-x-[-50%] translate-y-[-50%]">
        <p className="adjustLetterSpacing block leading-[1.45] whitespace-pre">
          {text}
        </p>
      </div>
    </div>
  );
}

function Carousel() {
  return (
    <div
      className="absolute h-[227px] left-[25px] top-[149px] w-[325px]"
      data-name="Carousel"
    >
      <div
        className="absolute bg-[50%_50%] bg-cover bg-no-repeat h-[227px] left-0 top-0 w-[325px]"
        data-name="tomato"
        style={{ backgroundImage: `url('${imgTomato}')` }}
      >
        <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Group28() {
  return (
    <BackgroundImageAndText text="K" additionalClassNames={["ml-24"]}>
      <circle
        cx="22"
        cy="22"
        fill="var(--fill-0, #FFC2C2)"
        id="Ellipse 176"
        r="21"
        stroke="var(--stroke-0, white)"
        strokeWidth="2"
      />
    </BackgroundImageAndText>
  );
}

function Group29() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-16 mt-0 place-items-start relative">
      <BackgroundImage25>
        <circle
          cx="22"
          cy="22"
          fill="var(--fill-0, #EBF29B)"
          id="Ellipse 178"
          r="21"
          stroke="var(--stroke-0, white)"
          strokeWidth="2"
        />
      </BackgroundImage25>
      <div className="[grid-area:1_/_1] css-wlbibp flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] ml-[20.5px] mt-[20.357px] not-italic relative text-[#1b1b1b] text-[12px] text-center text-nowrap tracking-[0.12px] translate-x-[-50%] translate-y-[-50%]">
        <p className="adjustLetterSpacing block leading-[1.45] whitespace-pre">
          GF
        </p>
      </div>
    </div>
  );
}

function Group30() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-8 mt-0 place-items-start relative">
      <BackgroundImage25>
        <circle
          cx="22"
          cy="22"
          fill="var(--fill-0, #426B1F)"
          id="Ellipse 177"
          r="21"
          stroke="var(--stroke-0, white)"
          strokeWidth="2"
        />
      </BackgroundImage25>
      <div className="[grid-area:1_/_1] css-22z1vg flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] ml-5 mt-[20.357px] not-italic relative text-[#ffffff] text-[12px] text-center text-nowrap tracking-[0.12px] translate-x-[-50%] translate-y-[-50%]">
        <p className="adjustLetterSpacing block leading-[1.45] whitespace-pre">
          VG
        </p>
      </div>
    </div>
  );
}

function Group31() {
  return (
    <BackgroundImageAndText text="DF" additionalClassNames={["ml-0"]}>
      <circle
        cx="22"
        cy="22"
        fill="var(--fill-0, #DEEAE8)"
        id="Ellipse 179"
        r="21"
        stroke="var(--stroke-0, white)"
        strokeWidth="2"
      />
    </BackgroundImageAndText>
  );
}

function Dietary() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="dietary"
    >
      <Group28 />
      <Group29 />
      <Group30 />
      <Group31 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-row items-start justify-between leading-[0] p-0 relative w-full">
        <Dietary />
        <div className="css-ifksun flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center not-italic relative shrink-0 text-[#426b1f] text-[18px] text-nowrap text-right">
          <p className="block leading-[16px] whitespace-pre">$3.99/lb</p>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute left-6 right-6 top-[400px]">
      <div className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative w-full">
        <Frame20 />
        <div className="css-w9luqw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left w-full">
          <Frame21BackgroundImage additionalClassNames={["block"]}>
            Made with fresh air and sunshine, freedom to forage outdoors year
            round. Tended by hand on small family farms.
          </Frame21BackgroundImage>
        </div>
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 327 1"
            >
              <line
                id="Line 7"
                stroke="var(--stroke-0, #E5E5E5)"
                x2="327"
                y1="0.5"
                y2="0.5"
              />
            </svg>
          </div>
        </div>
        <div className="css-w9luqw font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[0px] text-left w-full">
          <Frame21BackgroundImage additionalClassNames={["text-[16px]"]}>
            <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic text-[#000000]">{`Grown in San Juan Capistrano, CA `}</span>
            <span className="text-[#000000]">
              <br />
            </span>
            <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic text-[#000000]">{`by `}</span>
            <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic text-[#426b1f]">
              Ty Family Farm →
            </span>
          </Frame21BackgroundImage>
        </div>
      </div>
    </div>
  );
}

function Group631745() {
  return (
    <div className="absolute contents left-[60px] top-[-14px]">
      <div
        className="absolute bottom-[-20.366px] h-[158.366px] right-[-6px] w-[321px]"
        data-name="Vector"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 321 159"
        >
          <path
            d={svgPaths.p8639900}
            fill="var(--fill-0, #CCCAC2)"
            fillOpacity="0.2"
            id="Vector"
          />
        </svg>
      </div>
      <div
        className="absolute bottom-[-34.827px] h-[84.838px] right-[35.312px] w-[248.518px]"
        data-name="Vector"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 249 85"
        >
          <path
            d={svgPaths.pff300}
            fill="var(--fill-0, #CCCAC2)"
            fillOpacity="0.2"
            id="Vector"
          />
        </svg>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative shrink-0">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative">
        <div className="css-k5bps8 flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.16px]">
          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">
            1
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
                    id="Vector 26"
                    stroke="var(--stroke-0, black)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-lg shrink-0 w-[58px]"
      data-name="Input"
    >
      <div className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-4 py-3 relative w-[58px]">
          <Frame13 />
        </div>
      </div>
    </div>
  );
}

function IconAdd() {
  return (
    <BackgroundImage40 additionalClassNames={["relative", "shrink-0"]}>
      <g id="icon-add">
        <path d={svgPaths.p367b3d00} fill="var(--fill-0, white)" id="icon" />
      </g>
    </BackgroundImage40>
  );
}

function Button() {
  return (
    <div
      className="basis-0 bg-[#426b1f] grow min-h-px min-w-px relative rounded-lg shrink-0"
      data-name="Button"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-6 pr-4 py-2 relative w-full">
          <div className="basis-0 css-7ampam flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left tracking-[-0.16px]">
            <p className="block leading-[24px]">Add to basket</p>
          </div>
          <IconAdd />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute left-6 right-6 top-6">
      <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative w-full">
        <Input />
        <Button />
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute bg-[#ffffff] bottom-0 h-[124px] left-0 overflow-clip right-0 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      <Group631745 />
      <Frame19 />
    </div>
  );
}

function IconBasket() {
  return (
    <BackgroundImage40 additionalClassNames={["absolute", "left-0", "top-0"]}>
      <g id="icon-basket">
        <path d={svgPaths.p2003cd00} fill="var(--fill-0, black)" id="icon" />
      </g>
    </BackgroundImage40>
  );
}

function Badge() {
  return (
    <div
      className="absolute bg-[#426b1f] left-[17px] rounded-lg size-4 top-[-1px]"
      data-name="Badge"
    >
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-center justify-center px-0.5 py-px relative size-4">
          <div className="css-78fix6 flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-center text-nowrap tracking-[-0.12px]">
            <p className="adjustLetterSpacing block leading-none whitespace-pre">
              3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <div
      className="absolute right-5 rounded-2xl size-8 top-[18px]"
      data-name="Cart Icon"
    >
      <IconBasket />
      <Badge />
    </div>
  );
}

function Hamburger() {
  return (
    <div
      className="absolute h-1.5 left-[7px] top-[13px] w-[18px]"
      data-name="Hamburger"
    >
      <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 18 8"
        >
          <g id="Hamburger">
            <line
              id="Line 3"
              stroke="var(--stroke-0, black)"
              strokeWidth="1.5"
              x2="18"
              y1="1.25"
              y2="1.25"
            />
            <line
              id="Line 4"
              stroke="var(--stroke-0, black)"
              strokeWidth="1.5"
              x2="18"
              y1="7.25"
              y2="7.25"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <div
      className="absolute left-5 rounded-2xl size-8 top-[18px]"
      data-name="Menu Icon"
    >
      <Hamburger />
    </div>
  );
}

function MobileNav() {
  return (
    <div
      className="absolute bg-[#ffffff] h-16 left-0 overflow-clip right-0 top-[31px]"
      data-name="Mobile Nav"
    >
      <div className="absolute bg-[#ffffff] h-[66px] left-0 top-0 w-[375px]" />
      <div
        className="absolute css-v5bt0j flex flex-col font-['Newsreader:Medium',_sans-serif] font-medium justify-center leading-[0] text-[#426b1f] text-[24px] text-center text-nowrap top-9 tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%]"
        style={{ left: "calc(50% - 0.5px)" }}
      >
        <p className="adjustLetterSpacing block leading-none whitespace-pre">
          World Peas
        </p>
      </div>
      <CartIcon />
      <MenuIcon />
    </div>
  );
}

function SubNav() {
  return (
    <div className="relative shrink-0 w-full" data-name="Sub nav">
      <div className="box-border content-stretch flex flex-row font-normal items-center justify-start leading-[0] p-0 relative text-left w-full">
        <div className="basis-0 css-ip39ex flex flex-col font-['Newsreader:Regular',_sans-serif] grow justify-center min-h-px min-w-px relative shrink-0 text-[#000000] text-[24px] tracking-[-0.48px]">
          <p className="block leading-[32px]">Heirloom tomato</p>
        </div>
        <button className="[white-space-collapse:collapse] cursor-pointer flex flex-col font-['Inter:Regular',_sans-serif] justify-center not-italic relative shrink-0 text-[#426b1f] text-[14px] text-nowrap tracking-[-0.14px]">
          <p className="adjustLetterSpacing block leading-[24px] whitespace-pre">{`<- Back`}</p>
        </button>
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <div className="absolute left-6 right-6 top-[103px]" data-name="Top nav">
      <div className="box-border content-stretch flex flex-col gap-4 items-end justify-end p-0 relative w-full">
        <SubNav />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div
      className="absolute bg-[#ffffff] h-[149px] left-0 right-0 top-0"
      data-name="Header"
    >
      <MobileNav />
      <TopNav />
    </div>
  );
}

function Notch() {
  return (
    <NotchNotchBackgroundImage additionalClassNames={["contents"]}>
      <div
        className="absolute h-[33px] top-[-2px] translate-x-[-50%] w-[156px]"
        data-name="Notch"
        style={{ left: "calc(50% + 0.499992px)" }}
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 156 33"
        >
          <g id="Notch">
            <path d={svgPaths.p28770100} fill="black" />
            <path d={svgPaths.p28f48b80} fill="var(--fill-0, black)" />
            <path d={svgPaths.p14d82600} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
    </NotchNotchBackgroundImage>
  );
}

function StatusBarTime() {
  return (
    <div
      className="absolute h-[21px] rounded-3xl top-3.5 translate-x-[-50%] w-[54px]"
      data-name="_StatusBar-time"
      style={{ left: "calc(50% - 135.5px)" }}
    >
      <div className="absolute css-a0byvc font-['SF_Pro_Display:Bold',_sans-serif] h-5 leading-[0] left-[27px] not-italic text-[#000000] text-[17px] text-center top-px tracking-[-0.408px] translate-x-[-50%] w-[54px]">
        <p className="adjustLetterSpacing block leading-[22px]">9:41</p>
      </div>
    </div>
  );
}

function LeftSide() {
  return (
    <div
      className="absolute contents left-[25px] top-3.5"
      data-name="Left Side"
    >
      <StatusBarTime />
    </div>
  );
}

function StatusBarBattery() {
  return (
    <div
      className="absolute h-[13px] top-[19px] translate-x-[-50%] w-[27.401px]"
      data-name="_StatusBar-battery"
      style={{ left: "calc(50% + 150.201px)" }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 28 13"
      >
        <g id="_StatusBar-battery">
          <path
            d={svgPaths.p3f827980}
            id="Outline"
            opacity="0.35"
            stroke="var(--stroke-0, black)"
          />
          <path
            d={svgPaths.p5fdc300}
            fill="var(--fill-0, black)"
            id="Battery End"
            opacity="0.4"
          />
          <path d={svgPaths.pbee4a00} fill="var(--fill-0, black)" id="Fill" />
        </g>
      </svg>
    </div>
  );
}

function RightSide() {
  return (
    <div
      className="absolute contents left-[274px] top-[19px]"
      data-name="Right Side"
    >
      <StatusBarBattery />
      <div
        className="absolute bottom-[32.269%] left-[80%] right-[15.467%] top-[42.553%]"
        data-name="Wifi"
      >
        <div className="absolute bottom-[-0.002%] left-0 right-0 top-[0.002%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17 12"
          >
            <path
              d={svgPaths.p17a4bf30}
              fill="var(--fill-0, black)"
              id="Wifi"
            />
          </svg>
        </div>
      </div>
      <div
        className="absolute h-3 top-5 translate-x-[-50%] w-[18px]"
        data-name="Icon / Mobile Signal"
        style={{ left: "calc(50% + 95.5px)" }}
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 18 12"
        >
          <g id="Icon / Mobile Signal">
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

function StatusBar() {
  return (
    <div
      className="absolute h-[47px] left-0 overflow-clip right-0 top-0"
      data-name="StatusBar"
    >
      <Notch />
      <LeftSide />
      <RightSide />
    </div>
  );
}

export default function ProductTomato() {
  return (
    <div
      className="bg-[#ffffff] relative size-full"
      data-name="Product - Tomato"
    >
      <Carousel />
      <Frame21 />
      <Frame15 />
      <Header />
      <StatusBar />
    </div>
  );
}