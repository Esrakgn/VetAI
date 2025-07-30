import React from 'react';

interface CustomLogoIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const CustomLogoIcon: React.FC<CustomLogoIconProps> = ({
  width = 32,
  height = 32,
  color = '#4ade80',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 6C10 4.89543 10.8954 4 12 4H20C21.1046 4 22 4.89543 22 6V10C22 11.1046 21.1046 12 20 12H12C10.8954 12 10 11.1046 10 10V6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 12V28M16 28L12 24M16 28L20 24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 10H30"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28 8V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CustomLogoIcon;
