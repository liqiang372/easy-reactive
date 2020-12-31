import React from 'react';

export function Rect({
  x,
  y,
  width,
  height,
  fill = '#f5f9fa',
  stroke = 'black',
  className,
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ fill, stroke }}
      className={className}
    />
  );
}
