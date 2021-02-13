import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'
import { transformText } from '../utils'

export const BouncingBalls = ({x, y, ticks, width, onComplete}) => {
  const indexPool = useRef([]);
  const tickIndex = useRef(0);
  const gRef = useRef(null);
  useEffect(() => {
    if (gRef.current) {
      indexPool.current.sort((a ,b) => a - b);
      const ticksWithIndex = ticks.map((tick) => {
        if (indexPool.current.length > 0) {
          tick.index = indexPool.current.shift();
        } else {
          tick.index = tickIndex.current++;
        }
        return tick;
      })
      const balls = d3
        .select(gRef.current)
        .selectAll('circle')
        .data(ticksWithIndex, (tick) => {
          return tick.index
        });
      
      const ballsEnteredGroup = balls.enter()
        .append('g')
        .attr('transform', (d) => {
          return `translate(0, ${d.index * 25})`
        })
      ballsEnteredGroup
        .append('circle')
        .attr('r', 10)
        .attr('fill', 'darkgrey')
      ballsEnteredGroup
        .append('text')
        .text((d) => {
          return transformText(d.text, 'b');
        })
      ballsEnteredGroup
        .transition()
        .duration( () => {
          return 2000 + Math.floor(Math.random() * 2000);
        })
        .ease(d3.easeLinear)
        .attr('transform', (d) => {
          return `translate(${width}, ${d.index * 25})`
        })
        .on('end', function() {
          d3.select(gRef.current)
            .selectAll('circle')
            .attr('fill', 'darkgrey')
          
          d3.select(this)
            .select('circle')
            .attr('fill', '#fae55e')
          d3.select(this)
            .transition()
            .duration(1000)
            .remove()
            .on('end', (d) => {
              indexPool.current.push(d.index);
              if (onComplete) {
                onComplete({
                  ...d,
                  text: transformText(d.text, 'b')
                });
              }
            })
        })
    }
  }, [ticks]);
  return (
    <g ref={gRef} transform={`translate(${x}, ${y})`}>
        
    </g>
  )
}

BouncingBalls.defaultProps = {
  x: 0,
  y: 0,
  width: 200
}
