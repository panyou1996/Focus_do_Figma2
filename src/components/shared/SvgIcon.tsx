import React from 'react';

interface SvgIconProps {
  pathData: string;
  size?: number;
  color?: string;
  viewBox?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  pathData,
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={pathData} />
    </svg>
  );
};

export default SvgIcon;
