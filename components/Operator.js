import React from 'react';
import { COLORS } from '../constants';
function getPointsForPath(points) {
  let res = '';
  for (let i = 0; i < points.length; i++) {
    var point = points[i];
    res = res + (i === 0 ? 'M' : 'L');
    res += ` ${point.x} ${point.y} `;
  }
  return res;
}
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
export function Operator({
  x,
  y,
  width,
  height,
  fill = '#f5f9fa',
  stroke = 'black',
  side,
  angle,
  className,
}) {
  angle = (angle * Math.PI) / 180;
  const xOffset = side * Math.cos(angle);
  const yOffset = side * Math.sin(angle);
  const p1 = new Point(x, y);
  const p2 = new Point(x + width, y);
  const p3 = new Point(x, y + height);
  const p4 = new Point(x + width, y + height);
  const p5 = new Point(x + xOffset, y - yOffset);
  const p6 = new Point(x + xOffset + width, y - yOffset);
  const p7 = new Point(x + xOffset + width, y - yOffset + height);

  const outlinePath = getPointsForPath([p1, p5, p6, p7, p4, p3, p1]);
  const frontPath = getPointsForPath([p1, p2, p4, p3, p1]);
  const topPath = getPointsForPath([p1, p5, p6, p2, p1]);
  const rightPath = getPointsForPath([p2, p6, p7, p4, p2]);

  return (
    <g>
      <path d={frontPath} fill={COLORS.GREY_1} />
      <path d={topPath} fill={COLORS.GREY_2} />
      <path d={rightPath} fill={COLORS.GREY_3} />
      <path d={outlinePath} fill={'transparent'} stroke={stroke} />
    </g>
  );
}

Operator.defaultProps = {
  x: 0,
  y: 0,
  side: 10,
  angle: 45,
};
