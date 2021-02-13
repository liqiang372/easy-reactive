import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const Timer = ({ onComplete, x, y, r, strokeWidth, duration, ticks, showEmitAnimation = false ,removeAfterComplete }) => {
  const perimeter = 2 * Math.PI * r;
  const gRef = useRef(null);
  useEffect(() => {
    if (gRef.current) {
      const timers = d3
        .select(gRef.current)
        .selectAll('g')
        .data(ticks, (tick) => {
          return tick.key
        });
      
      const timerContainer = timers
        .enter()
        .append('g')
      timerContainer
        .append('circle')
        .attr('r', r)
        .attr('stroke', '#d7d7d7')
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'transparent')

      timerContainer
        .append('circle')
        .style('transform', 'rotateZ(-90deg)')
        .attr('r', r)
        .attr('stroke', '#f08d49')
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'transparent')
        .attr('stroke-dasharray', perimeter)
        .attr('stroke-dashoffset', perimeter)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('end', (d) => {
          if(onComplete) {
            onComplete(d);
          }
          if (removeAfterComplete) {
            timerContainer
              .transition()
              .duration(500)
              .ease(d3.easeBackIn)
              .style('transform', 'scale(0.1)')
              .remove();
          }
        })

      let timersExist = timers.exit();
      // stop existing transitions
      timersExist
        .selectAll('circle')
        .transition()
      if (showEmitAnimation) {
        timersExist = timersExist
          .transition()
          .duration(2000)
          .ease(d3.easeCubicOut)
          .style('transform', 'translate(100px, -100px) scale(0.1)')
      }
      timersExist
        .remove()
    }
  }, [ticks]);

  return (
    <g ref={gRef} transform={`translate(${x}, ${y})`}>
    </g>
  );
};

Timer.defaultProps = {
  x: 0,
  y: 0,
  r: 50,
  strokeWidth: 8,
  duration: 4000,
  ticks: []
};
