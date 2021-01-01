import React, { useRef, useEffect } from 'react';
import { Rect } from './Rect';
import * as d3 from 'd3';

export const Stream = ({
  x,
  y,
  width,
  height,
  duration,
  data,
  startOffset,
  endOffset,
  onEmit,
}) => {
  const gRef = useRef(null);
  useEffect(() => {
    const items = d3
      .select(gRef.current)
      .selectAll('text')
      .data(data, (d) => {
        if (d.key) {
          return d.key;
        }
        return d;
      });

    items
      .enter()
      .append('text')
      .attr('x', `${0 - startOffset}`)
      .attr('y', 15)
      .text((d) => {
        if (d.text) {
          return d.text;
        }
        return d;
      })
      .transition()
      .ease(d3.easeLinear)
      .on('end', (d) => {
        if (onEmit) {
          onEmit(d);
        }
      })
      .attr('transform', `translate(${startOffset + width + endOffset})`)
      .duration(duration);
    items.exit().remove();
  }, [data, width, duration]);
  return (
    <g ref={gRef} transform={`translate(${x}, ${y})`}>
      <Rect x={0} y={0} width={width} height={height} />
    </g>
  );
};

Stream.defaultProps = {
  x: 0,
  y: 0,
  width: 200,
  height: 20,
  startOffset: 10,
  endOffset: 10,
  duration: 2000,
};
