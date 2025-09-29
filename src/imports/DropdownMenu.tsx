function MenuItem() {
  return (
    <div className="relative shrink-0 w-full" data-name="_MenuItem_">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-4 py-2 relative w-full">
          <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-left text-nowrap">
            <p className="block leading-[1.5] whitespace-pre">Menu Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DropdownMenu() {
  return (
    <div
      className="bg-[#ffffff] relative rounded-bl-[4px] rounded-br-[4px] shadow-[0px_4px_4px_0px_rgba(26,26,26,0.25)] size-full"
      data-name="Dropdown Menu"
    >
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip px-0 py-2 relative size-full">
          {[...Array(4).keys()].map((_, i) => (
            <MenuItem key={i} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[-2px_0px_0px_0px_inset_#6b6b6b,0px_-2px_0px_0px_inset_#6b6b6b,2px_0px_0px_0px_inset_#6b6b6b]" />
    </div>
  );
}