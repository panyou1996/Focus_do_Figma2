import svgPaths from "./svg-ved004mhkj";

function Frame13() {
  return (
    <div className="relative shrink-0">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative">
        <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap tracking-[-0.16px]">
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
    <div className="relative shrink-0 size-8" data-name="icon-add">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g id="icon-add">
          <path d={svgPaths.p367b3d00} fill="var(--fill-0, white)" id="icon" />
        </g>
      </svg>
    </div>
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
          <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left tracking-[-0.16px]">
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

export default function Footer() {
  return (
    <div
      className="bg-[#ffffff] relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] size-full"
      data-name="Footer"
    >
      <Frame19 />
    </div>
  );
}