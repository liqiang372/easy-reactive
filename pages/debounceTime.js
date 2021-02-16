import React, { useRef, useEffect, useState } from 'react';
import { Operator } from '../components/Operator';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import * as d3 from 'd3';

export default function DebounceTime() {
  const svgRef = useRef(null);
  const [tick, setTick] = useState([]);
  useEffect(() => {
    if (svgRef.current) {
      const ticks = d3
        .select('g')
        .selectAll('circle')
        .data(tick, (d) => d);

      const color = d3.interpolateRainbow(Math.random() * 100);
      ticks
        .enter()
        .append('circle')
        .attr('cx', 190)
        .attr('cy', 160)
        .attr('r', 8)
        .attr('fill', color)
        .transition()
        .delay(200)
        .ease(d3.easeLinear)
        .on('end', () => {
          // alert('end');
        })
        .attr('transform', 'translate(220)')
        .duration(4000);

      ticks
        .exit()
        .transition()
        .ease(d3.easeLinear)
        .style('opacity', 0)
        .remove();
    }
  }, [tick]);
  const emit = () => {
    setTick((prevState) => {
      return prevState.length === 0 ? [0] : [prevState[0] + 1];
    });
  };
  return (
    <Layout title="debounceTime">
      <main>
        <h1>DebounceTime</h1>
        <div className="demo">
          <svg ref={svgRef} className="animation" viewBox="0 0 800 300" width="100%" height="100%">
            <g>
              <Operator x={200} y={135} width={200} height={50} />
            </g>
          </svg>
        </div>
        <div>
          <Button onClick={emit}>Emit</Button>
        </div>
      </main>
    </Layout>
  );
}
