import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import cns from 'classnames';

export const Queue = ({
  className,
  x,
  y,
  width,
  height,
  duration,
  data,
  mode,
}) => {
  const gRef = useRef(null);
  useEffect(() => {
    const items = d3
      .select(gRef.current)
      .selectAll('.queueItem')
      .data(data, (d) => {
        if (d.key) {
          return d.key;
        }
        return d;
      });
    if (['exit', undefined].includes(mode)) {
      items.exit().remove();
    }
    const itemsEnter = items.enter().append('g').attr('class', 'queueItem');
    itemsEnter.append('rect');
    itemsEnter.append('text');

    if (['enter', 'update', undefined].includes(mode)) {
      let itemsToDraw;
      if (mode === 'enter') {
        itemsToDraw = itemsEnter;
      } else if (mode === 'update') {
        itemsToDraw = items;
      } else {
        itemsToDraw = itemsEnter.merge(items);
      }
      itemsToDraw
        .select('rect')
        .attr('x', (d, index) => index * width)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill', 'none');
      itemsToDraw
        .select('text')
        .attr('x', (d, index) => width / 2 + index * width)
        .attr('y', height / 2 + 4)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text((d) => d.text);
    }
  }, [data, x, y, width, height, duration]);

  return (
    <g
      className={cns(className, 'queue')}
      ref={gRef}
      transform={`translate(${x}, ${y})`}
    ></g>
  );
};

Queue.defaultProps = {
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  duration: 2000,
};
