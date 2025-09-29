import svgPaths from "./svg-s5y93igtx2";
import clsx from "clsx";
import imgRectangle6538 from "figma:asset/39a095c5219433210528f313f4db7ed09e8b6466.png";
import imgRectangle6539 from "figma:asset/c7319cef2b86a8f71b6765b77a10caccb7fc8b83.png";
import imgRectangle6540 from "figma:asset/1b41f753535d961cfbba08b0eb03a1902c09f7f3.png";
import imgRectangle6541 from "figma:asset/07e73d3701b2c2cf9a8054b1b2606088545c1b53.png";
import imgRectangle6542 from "figma:asset/345d9f75120e49e4b6f691447bccd48abfb67431.png";
import imgRectangle6543 from "figma:asset/28818bcf637e7596ffec2602b44c1b407fe11cf9.png";
import imgRectangle6544 from "figma:asset/d55ecea918fdfbe2d236a4386a73a981bf45f319.png";
import imgRectangle6545 from "figma:asset/464f20b81f02057b5cc69adbc19fb20af709c271.png";
import imgRectangle6546 from "figma:asset/365c8fc0f53d1bc2bad0988227099e87b4730cbc.png";
import imgRectangle6547 from "figma:asset/f286a5e73a18e796afd61d7b68c51addff2c69b6.png";
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
type BackgroundImage131Props = {
  additionalClassNames?: string[];
};

function BackgroundImage131({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImage131Props>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative w-full">
        {children}
      </div>
    </div>
  );
}
type BackgroundImage116Props = {
  additionalClassNames?: string[];
};

function BackgroundImage116({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImage116Props>) {
  return (
    <div
      className={clsx(
        "bg-[#ffffff] relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] shrink-0 w-full",
        additionalClassNames,
      )}
    >
      <div className="box-border content-stretch flex flex-row items-start justify-start overflow-clip p-0 relative w-full">
        {children}
      </div>
    </div>
  );
}

function BackgroundImage101({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="css-w9luqw flex flex-col justify-center relative shrink-0 text-[#000000] text-[0px] w-[173px]">
      <p className="leading-[16px] text-[14px]">{children}</p>
    </div>
  );
}

function BackgroundImage86({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-2 items-start justify-start leading-[0] not-italic p-0 relative text-left w-full">
        {children}
      </div>
    </div>
  );
}

function BackgroundImage71({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative size-full">
      <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start px-4 py-2 relative">
        {children}
      </div>
    </div>
  );
}
type BackgroundImage56Props = {
  additionalClassNames?: string[];
};

function BackgroundImage56({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImage56Props>) {
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

function BackgroundImage41({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative self-stretch shrink-0">
      <div className="flex flex-col justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center pl-4 pr-8 py-4 relative size-full">
          {children}
        </div>
      </div>
    </div>
  );
}
type BackgroundImage27Props = {
  additionalClassNames?: string[];
};

function BackgroundImage27({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<BackgroundImage27Props>) {
  return (
    <BackgroundImage56 additionalClassNames={additionalClassNames}>
      <g id="Like">{children}</g>
    </BackgroundImage56>
  );
}

function BackgroundImage13({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative rounded-xl shrink-0">
      <div className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-xl" />
      <BackgroundImage71>
        <div className="css-k6fayy flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap tracking-[-0.14px]">
          <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">
            {children}
          </p>
        </div>
      </BackgroundImage71>
    </div>
  );
}
type BreadcumbBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string[];
};

function BreadcumbBackgroundImageAndText({
  text,
  additionalClassNames = [],
}: BreadcumbBackgroundImageAndTextProps) {
  return (
    <div
      className={clsx(
        "flex flex-col justify-center relative shrink-0",
        additionalClassNames,
      )}
    >
      <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre">
        {text}
      </p>
    </div>
  );
}
type BackgroundImage1Props = {
  text: string;
  text1: string;
  text2: string;
};

function BackgroundImage1({ text, text1, text2 }: BackgroundImage1Props) {
  return (
    <BackgroundImage86>
      <BackgroundImage101>
        {text}
        <span>
          <br />
        </span>
        <span className="text-[#426b1f]">{text1}</span>
      </BackgroundImage101>
      <div className="css-415rgs relative shrink-0 text-[#757575] text-[12px] text-nowrap">
        <p className="block leading-[1.6] whitespace-pre">{text2}</p>
      </div>
    </BackgroundImage86>
  );
}

function LikeBackgroundImage() {
  return (
    <BackgroundImage27 additionalClassNames={["absolute", "right-2", "top-2"]}>
      <path
        d={svgPaths.p1177b300}
        id="Vector"
        stroke="var(--stroke-0, black)"
      />
      <path
        d={svgPaths.p1d24580}
        fill="var(--fill-0, #FF8577)"
        fillOpacity="0.98"
        id="Vector_2"
      />
    </BackgroundImage27>
  );
}

function ButtonBackgroundImage() {
  return (
    <div className="absolute bg-[#426b1f] bottom-2 right-2 rounded-lg">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative">
        <IconaddBackgroundImage />
      </div>
    </div>
  );
}

function IconaddBackgroundImage() {
  return (
    <BackgroundImage56 additionalClassNames={["relative", "shrink-0"]}>
      <g id="icon-add">
        <path d={svgPaths.p367b3d00} fill="var(--fill-0, white)" id="icon" />
      </g>
    </BackgroundImage56>
  );
}
type BackgroundImageProps = {
  text: string;
  text1: string;
  text2: string;
};

function BackgroundImage({ text, text1, text2 }: BackgroundImageProps) {
  return (
    <BackgroundImage86>
      <BackgroundImage101>
        <span className="text-[#000000]">{text}</span>
        <span>
          <br />
        </span>
        <span className="text-[#426b1f]">{text1}</span>
      </BackgroundImage101>
      <div className="css-415rgs relative shrink-0 text-[#757575] text-[12px] text-nowrap">
        <p className="block leading-[1.6] whitespace-pre">{text2}</p>
      </div>
    </BackgroundImage86>
  );
}

function Frame11() {
  return (
    <BackgroundImage41>
      <BackgroundImage
        text="Garlic clove"
        text1="$0.89 each"
        text2="Kunisaki Farms →"
      />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function Like() {
  return (
    <BackgroundImage27 additionalClassNames={["relative", "shrink-0"]}>
      <g id="Vector">
        <path
          d={svgPaths.p297cea80}
          fill="var(--fill-0, #FF8577)"
          fillOpacity="0.98"
        />
        <path
          d={svgPaths.p1177b300}
          stroke="var(--stroke-0, #FF8577)"
          strokeOpacity="0.98"
        />
      </g>
      <path
        d={svgPaths.p3bfbe380}
        fill="var(--fill-0, #FF8577)"
        fillOpacity="0.98"
        id="Vector_2"
      />
    </BackgroundImage27>
  );
}

function GarlicClove() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded-[11px]"]}>
      <div
        className="[background-size:cover,_cover,_auto] bg-[#d9d9d9] relative self-stretch shrink-0 w-[93px]"
        style={{
          backgroundImage: `url('${imgRectangle6538}'), url('${imgRectangle6539}')`,
        }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame11 />
      <Like />
    </BackgroundImage116>
  );
}

function Frame14() {
  return (
    <BackgroundImage41>
      <BackgroundImage
        text="Sugar snap pea"
        text1="$2.29/lb"
        text2="Helmbolt Orchards →"
      />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function SugarSnapPea() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="[background-size:cover,_cover,_auto] bg-[#d9d9d9] relative self-stretch shrink-0 w-[93px]"
        style={{
          backgroundImage: `url('${imgRectangle6540}'), url('${imgRectangle6539}')`,
        }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame14 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Frame16() {
  return (
    <BackgroundImage41>
      <BackgroundImage text="Ginger" text1="$4.20/lb" text2="Bui Farms →" />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function Ginger() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="[background-size:cover,_auto] bg-[#d9d9d9] relative self-stretch shrink-0 w-[93px]"
        style={{ backgroundImage: `url('${imgRectangle6541}')` }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame16 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Frame18() {
  return (
    <BackgroundImage41>
      <BackgroundImage
        text="Sweet onion"
        text1="$0.39/lb"
        text2="Castelao Farms →"
      />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function SweetOnion() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="bg-[50%_50%] bg-cover bg-no-repeat relative self-stretch shrink-0 w-[93px]"
        style={{ backgroundImage: `url('${imgRectangle6542}')` }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame18 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Frame20() {
  return (
    <BackgroundImage41>
      <BackgroundImage1
        text="Raspberries"
        text1="$3.99 pint"
        text2="Bernal Growers →"
      />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function Raspberries() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="[background-size:cover,_auto] bg-[#d9d9d9] relative self-stretch shrink-0 w-[93px]"
        style={{ backgroundImage: `url('${imgRectangle6543}')` }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame20 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Frame22() {
  return (
    <BackgroundImage41>
      <BackgroundImage1 text="Bananas" text1="$0.64/lb" text2="Lowry Farms →" />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function Bannas() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="[background-size:82.56%_84.38%] bg-[50%_50%] bg-no-repeat relative self-stretch shrink-0 w-[93px]"
        style={{ backgroundImage: `url('${imgRectangle6544}')` }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame22 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Frame24() {
  return (
    <BackgroundImage41>
      <BackgroundImage1
        text="Avocados"
        text1="$1.05 each"
        text2="Gonzalez Produce →"
      />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function Avacados() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="[background-size:90.62%_73.16%] bg-[50%_61%] bg-no-repeat relative self-stretch shrink-0 w-[93px]"
        style={{ backgroundImage: `url('${imgRectangle6545}')` }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame24 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Frame26() {
  return (
    <BackgroundImage41>
      <BackgroundImage1
        text="Kale"
        text1="$1.99 each"
        text2="Green Growers →"
      />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function Kale() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="bg-[50%_50%] bg-cover bg-no-repeat relative self-stretch shrink-0 w-[93px]"
        style={{ backgroundImage: `url('${imgRectangle6546}')` }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame26 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Frame28() {
  return (
    <BackgroundImage41>
      <BackgroundImage1
        text="Radish"
        text1="$1.29 each"
        text2="Gonzalez Produce →"
      />
      <ButtonBackgroundImage />
    </BackgroundImage41>
  );
}

function Radish() {
  return (
    <BackgroundImage116 additionalClassNames={["rounded"]}>
      <div
        className="bg-[50%_50%] bg-cover bg-no-repeat relative self-stretch shrink-0 w-[93px]"
        style={{ backgroundImage: `url('${imgRectangle6547}')` }}
      >
        <div className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      </div>
      <Frame28 />
      <LikeBackgroundImage />
    </BackgroundImage116>
  );
}

function Content() {
  return (
    <BackgroundImage131
      additionalClassNames={["left-[25px]", "right-[23px]", "top-[225px]"]}
    >
      <GarlicClove />
      <SugarSnapPea />
      <Ginger />
      <SweetOnion />
      <Raspberries />
      <Bannas />
      <Avacados />
      <Kale />
      <Radish />
    </BackgroundImage131>
  );
}

function IconBasket() {
  return (
    <BackgroundImage56 additionalClassNames={["absolute", "left-0", "top-0"]}>
      <g id="icon-basket">
        <path d={svgPaths.p2003cd00} fill="var(--fill-0, black)" id="icon" />
      </g>
    </BackgroundImage56>
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

function Breadcumb() {
  return (
    <div
      className="basis-0 grow min-h-px min-w-px relative shrink-0"
      data-name="Breadcumb"
    >
      <div className="box-border content-stretch flex flex-row font-['Newsreader:Regular',_sans-serif] font-normal gap-0.5 items-start justify-start leading-[0] p-0 relative text-[24px] text-left text-nowrap tracking-[-0.48px] w-full">
        <BreadcumbBackgroundImageAndText
          text="All Aisles"
          additionalClassNames={["css-eomsl1", "text-[#757575]"]}
        />
        <div className="css-eomsl1 flex flex-col justify-center relative shrink-0 text-[#757575]">
          <p className="adjustLetterSpacing block leading-[32px] text-nowrap whitespace-pre">
            /
          </p>
        </div>
        <BreadcumbBackgroundImageAndText
          text="Produce"
          additionalClassNames={["css-ip39ex", "text-[#000000]"]}
        />
      </div>
    </div>
  );
}

function IconSearch() {
  return (
    <BackgroundImage56 additionalClassNames={["relative", "shrink-0"]}>
      <g id="icon-search">
        <path d={svgPaths.p14ffce80} fill="var(--fill-0, black)" id="Union" />
      </g>
    </BackgroundImage56>
  );
}

function SubNav() {
  return (
    <div className="relative shrink-0 w-full" data-name="Sub nav">
      <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative w-full">
        <Breadcumb />
        <IconSearch />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#426b1f] relative rounded-xl shrink-0">
      <BackgroundImage71>
        <div className="css-79j43w flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap tracking-[-0.14px]">
          <p className="adjustLetterSpacing block leading-[1.3] whitespace-pre">
            Default
          </p>
        </div>
      </BackgroundImage71>
    </div>
  );
}

function Frame4() {
  return <BackgroundImage13>A-Z</BackgroundImage13>;
}

function Frame3() {
  return <BackgroundImage13>{`$ -> $$`}</BackgroundImage13>;
}

function Frame8() {
  return (
    <div className="relative shrink-0">
      <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative">
        <Frame1 />
        <Frame4 />
        <Frame3 />
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <BackgroundImage131
      additionalClassNames={["left-6", "right-4", "top-[103px]"]}
    >
      <SubNav />
      <Frame8 />
    </BackgroundImage131>
  );
}

function Header() {
  return (
    <div
      className="absolute bg-[#ffffff] h-[201px] left-0 right-0 top-0"
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

export default function ProduceDefault() {
  return (
    <div
      className="bg-[#ffffff] relative size-full"
      data-name="Produce (Default)"
    >
      <Content />
      <Header />
      <StatusBar />
    </div>
  );
}