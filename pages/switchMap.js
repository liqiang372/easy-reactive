import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Button } from '../components/Button';
import { Timer } from '../components/Timer';
import { transformText } from '../utils';

const DOC = `
Unlike \`mergeMap\` that will subscribe to all internal Observables created, \`switchMap\` will discard(unsubscribe)
previous Observable once a new one is created. It is often used to cancel http request. Even if your http utility
doesn't support cancelation, \`switchMap\` can still be used to discard stale response and use the latest one.
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
  switchMap((a) => from(fetchMovie(a)))
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

  const onBEmit = useCallback((d) => {
    emit('b', { clearBefore: d });
  });

  return (
    <Layout title="switchMap">
      <main>
        <h1>switchMap</h1>
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
              <g transform="translate(200, -20)">
                <Operator width={90} height={90} tooltip="switchMap" />
                <Timer
                  x={44}
                  y={44}
                  r={20}
                  onComplete={(d) => {
                    emit('b', { valueToEmit: {
                      ...d,
                      text: transformText(d.text, 'b')
                    }});
                  }}
                  ticks={ticks}
                  showEmitAnimation
                  removeAfterComplete
                />
              </g>
              <Stream
                data={tickB}
                x={294}
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
