import svgPaths from "./svg-rtzumy3dpq";
import clsx from "clsx";
import imgProductImage from "figma:asset/c7319cef2b86a8f71b6765b77a10caccb7fc8b83.png";
import imgProductImage1 from "figma:asset/07e73d3701b2c2cf9a8054b1b2606088545c1b53.png";
import imgProductImage2 from "figma:asset/d55ecea918fdfbe2d236a4386a73a981bf45f319.png";
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
type BackgroundImage46Props = {
  additionalClassNames?: string[];
};

function BackgroundImage46({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImage46Props>) {
  return <p className={clsx(additionalClassNames)}>{children}</p>;
}
type BackgroundImage29Props = {
  additionalClassNames?: string[];
};

function BackgroundImage29({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImage29Props>) {
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
type BackgroundImage14Props = {
  text: string;
};

function BackgroundImage14({
  children,
  text,
}: React.PropsWithChildren<BackgroundImage14Props>) {
  return (
    <div className="absolute bg-[#ffffff] left-[86px] rounded-lg top-11">
      <div className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-lg" />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-2 py-1 relative">
          <div className="relative shrink-0">
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative">
              <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
                  {text}
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
        </div>
      </div>
    </div>
  );
}
type BackgroundImageProps = {
  text: string;
  text1: string;
  additionalClassNames?: string[];
};

function BackgroundImage({
  text,
  text1,
  additionalClassNames = [],
}: BackgroundImageProps) {
  return (
    <BackgroundImage46
      additionalClassNames={["leading-[16px]", ...additionalClassNames]}
    >
      <span className="text-[#000000]">{text}</span>
      <span>
        <br />
      </span>
      <span className="text-[#426b1f]">{text1}</span>
    </BackgroundImage46>
  );
}

function ProductItem() {
  return (
    <div
      className="bg-[#ffffff] h-[88px] relative shrink-0 w-[327px]"
      data-name="Product item"
    >
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div
        className="absolute bg-[50%_50%] bg-cover bg-no-repeat left-0 rounded size-[72px] top-0"
        data-name="Product image"
        style={{ backgroundImage: `url('${imgProductImage}')` }}
      />
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[86px] not-italic text-[#000000] text-[0px] text-left top-4 translate-y-[-50%] w-[173px]">
        <BackgroundImage
          text="Heirloom tomato"
          text1="$3.99/lb"
          additionalClassNames={["text-[14px]"]}
        />
      </div>
      <BackgroundImage14 text="3" />
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic right-0 text-[#757575] text-[14px] text-nowrap text-right top-[58px] translate-y-[-50%]">
        <p className="block leading-[16px] whitespace-pre">$2.49</p>
      </div>
    </div>
  );
}

function ProductItem1() {
  return (
    <div
      className="bg-[#ffffff] h-[88px] relative shrink-0 w-[327px]"
      data-name="Product item"
    >
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div
        className="absolute bg-[50%_50%] bg-cover bg-no-repeat left-0 rounded size-[72px] top-0"
        data-name="Product image"
        style={{ backgroundImage: `url('${imgProductImage1}')` }}
      />
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[86px] not-italic text-[#000000] text-[14px] text-left top-4 translate-y-[-50%] w-[173px]">
        <BackgroundImage text="Ginger" text1="$4.20/lb" />
      </div>
      <BackgroundImage14 text="3" />
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic right-0 text-[#757575] text-[14px] text-nowrap text-right top-[58px] translate-y-[-50%]">
        <p className="block leading-[16px] whitespace-pre">$4.72</p>
      </div>
    </div>
  );
}

function ProductItem2() {
  return (
    <div
      className="bg-[#ffffff] h-[88px] relative shrink-0 w-[327px]"
      data-name="Product item"
    >
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div
        className="[background-size:82.56%_84.38%] absolute bg-[50%_50%] bg-no-repeat left-0 rounded size-[72px] top-0"
        data-name="Product image"
        style={{ backgroundImage: `url('${imgProductImage2}')` }}
      />
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-[86px] not-italic text-[#000000] text-[14px] text-left top-4 translate-y-[-50%] w-[173px]">
        <p className="leading-[16px]">
          Bananas
          <span>
            <br />
          </span>
          <span className="text-[#426b1f]">$0.64/lb</span>
        </p>
      </div>
      <BackgroundImage14 text="1" />
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic right-0 text-[#757575] text-[14px] text-nowrap text-right top-[58px] translate-y-[-50%]">
        <p className="block leading-[16px] whitespace-pre">$3.64</p>
      </div>
    </div>
  );
}

function ProductList() {
  return (
    <div className="absolute left-6 top-[187px]" data-name="Product list">
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative">
        <ProductItem />
        <ProductItem1 />
        <ProductItem2 />
      </div>
    </div>
  );
}

function IconForward() {
  return (
    <BackgroundImage29 additionalClassNames={["relative", "shrink-0"]}>
      <g id="icon-forward">
        <path d={svgPaths.p3d7c1f80} fill="var(--fill-0, white)" id="icon" />
      </g>
    </BackgroundImage29>
  );
}

function Button() {
  return (
    <div
      className="absolute bg-[#426b1f] left-6 right-6 rounded-lg top-6"
      data-name="Button"
    >
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start pl-6 pr-4 py-2 relative w-full">
          <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left tracking-[-0.16px]">
            <p className="block leading-[24px]">Proceed to checkout</p>
          </div>
          <IconForward />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 h-[124px] left-0 overflow-clip right-0 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]"
      data-name="Footer"
    >
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-6 not-italic text-[#426b1f] text-[14px] text-left text-nowrap top-[94px] tracking-[-0.14px] translate-y-[-50%]">
        <BackgroundImage46
          additionalClassNames={["leading-[24px]", "whitespace-pre"]}
        >
          <span className="font-['Inter:Bold',_sans-serif] font-bold not-italic text-[#426b1f]">{`Hooray! `}</span>
          <span className="adjustLetterSpacing text-[#757575]">
            You qualify for free shipping
          </span>
        </BackgroundImage46>
      </div>
      <Button />
    </div>
  );
}

function IconBasket() {
  return (
    <BackgroundImage29 additionalClassNames={["absolute", "left-0", "top-0"]}>
      <g id="icon-basket">
        <path d={svgPaths.p2003cd00} fill="var(--fill-0, black)" id="icon" />
      </g>
    </BackgroundImage29>
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
          <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-center text-nowrap tracking-[-0.12px]">
            <p className="adjustLetterSpacing block leading-none whitespace-pre">
              7
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
      data-name="Mobile nav"
    >
      <div className="absolute bg-[#ffffff] h-[66px] left-0 top-0 w-[375px]" />
      <div
        className="absolute flex flex-col font-['Newsreader:Medium',_sans-serif] font-medium justify-center leading-[0] text-[#426b1f] text-[24px] text-center text-nowrap top-9 tracking-[-0.24px] translate-x-[-50%] translate-y-[-50%]"
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
        <div className="basis-0 flex flex-col font-['Newsreader:Regular',_sans-serif] grow justify-center min-h-px min-w-px relative shrink-0 text-[#000000] text-[24px] tracking-[-0.48px]">
          <p className="block leading-[32px]">My Basket</p>
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
      <div className="absolute border-[0px_0px_1px] border-neutral-200 border-solid inset-0 pointer-events-none shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]" />
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

export default function MyBasket() {
  return (
    <div className="bg-[#ffffff] relative size-full" data-name="My Basket">
      <ProductList />
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] left-6 not-italic text-[#000000] text-[18px] text-left text-nowrap top-[518px] translate-y-[-50%]">
        <p className="block leading-[1.45] whitespace-pre">Subtotal</p>
      </div>
      <div
        className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic text-[#426b1f] text-[18px] text-nowrap text-right top-[518px] translate-x-[-100%] translate-y-[-50%]"
        style={{ left: "calc(50% + 163.5px)" }}
      >
        <p className="block leading-[1.45] whitespace-pre">$10.85</p>
      </div>
      <Footer />
      <Header />
      <StatusBar />
    </div>
  );
}