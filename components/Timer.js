import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const Timer = ({ onComplete, x, y, r, strokeWidth, duration }) => {
  const perimeter = 2 * Math.PI * r;
  const gRef = useRef(null);
  const circleRef = useRef(null);
  useEffect(() => {
    if (gRef.current && circleRef.current) {
      const elapse = d3.select(circleRef.current);
      function startTimer() {
        elapse
          .attr('stroke-dashoffset', perimeter)
          .transition()
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .duration(duration)
          .on('end', () => {
            if (onComplete) {
              onComplete();
            }
            startTimer();
          });
      }
      startTimer();
    }
  }, []);

  return (
    <g ref={gRef}>
      <circle
        x={x}
        y={x}
        r={r}
        stroke="#f2f2f1"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        ref={circleRef}
        x={x}
        y={y}
        r={r}
        stroke="#f08d49"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={perimeter}
        className="elapse"
      />
      <style jsx>{`
        .elapse {
          transform: rotateZ(-90deg);
        }
      `}</style>
    </g>
  );
};

Timer.defaultProps = {
  x: 50,
  y: 50,
  r: 50,
  strokeWidth: 8,
  duration: 4000,
};
