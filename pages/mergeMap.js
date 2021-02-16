import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Button } from '../components/Button';
import { Timer } from '../components/Timer';
import { BouncingBalls } from '../components/BouncingBalls';

const DOC = `
\`mergeMap\` is a combination of \`map\` + \`mergeAll\`. 
~~~js
const fetchMovie = (name) => {
  return new Prmose((resolve) => {
    setTimeout(() => {
      resolve({
        name
      })
    }, 2000);
  })
}

a$.pipe(
  mergeMap((a) => from(fetchMovie(a)))
).subscribe((b) => {
  console.log(b);
})

// is exactly the same as 

a$.pipe(
  map((a) => from(fetchMovie(a))),
  mergeAll()
).subscribe((b) => {
  console.log(b);
})
~~~
`;

export default function Map() {
  const [emit, tickA, tickB] = useStream(2);
  const [ticks, setTicks] = useState([]);

  const reset = () => {
    d3.select('.animation').selectAll('*').interrupt();
    emit('reset');
    setTicks([]);
  };


  const onAEmit = (d) => {
    setTicks([d]);
  }

  const onBEmit = (d) => {
    emit('b', { clearBefore: d });
  };

  const onMergeMapEmit = (d) => {
    emit('b', { valueToEmit: d });
  }

  return (
    <Layout title="mergeMap">
      <main>
        <h1>mergeMap</h1>
        <div className="demo">
          <svg className="animation" viewbox="0 0 800 300" width="100%" height="100%">
            <g transform="translate(150, 100)">
              <Stream
                data={tickA}
                x={50}
                y={10}
                width={150}
                height={20}
                onEmit={onAEmit}
                key="a"
              />
              <g transform="translate(200, -70)">
                <Operator width={200} height={200} tooltip="switchMap" />
                <BouncingBalls x={10} y={15} ticks={ticks} width={160} onComplete={onMergeMapEmit}/>
              </g>
              <Stream
                data={tickB}
                x={404}
                y={10}
                width={150}
                height={20}
                onEmit={onBEmit}
                key="b"
              />
            </g>
          </svg>
        </div>
        <div>
          <div className="btn-group">
            <Button type="emit" onClick={() => emit('a')}>
              Emit A
            </Button>
            <Button type="reset" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
