import React, { useRef, useEffect, useState } from 'react';
import { Rect } from '../components/Rect';
import { Layout } from '../components/Layout';
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
    <Layout title="Debounce Time">
      <main>
        <div>
          <h1>DebounceTime</h1>
          <div className="demo">
            <svg ref={svgRef} className="animation">
              <g>
                <Rect x={200} y={150} width={200} height={20} />
              </g>
            </svg>
          </div>
          <div>
            <button onClick={emit}>Emit</button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
