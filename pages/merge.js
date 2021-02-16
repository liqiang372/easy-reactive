import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject, merge } from 'rxjs';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Button } from '../components/Button';

const DOC = `
~~~js
merge(a$, b$).subscribe((x) => {
  console.log(x);
})
~~~
`;

const a$ = new Subject();
const b$ = new Subject();

export default function Merge() {
  const [emit, tickA, tickB, tickC] = useStream(3);
  const sub = useRef(null);
  const setUpOperator = () => {
    return merge(a$, b$).subscribe((x) => {
      emit('c', { valueToEmit: x })
    })
  };

  const reset = () => {
    d3.select('.animation').selectAll('*').interrupt();
    emit('reset');
    if (sub.current) {
      sub.current.unsubscribe();
      sub.current = setUpOperator();
    }
  };


  const onAEmit = useCallback((d) => {
    emit('a', { clearBefore: d })
    a$.next(d);
  }, [emit]);

  const onBEmit = useCallback((d) => {
    emit('b', { clearBefore: d });
    b$.next(d);
  }, [emit])

  const onCEmit = useCallback((d) => {
    emit('c', { clearBefore: d })
  })

  useEffect(() => {
    sub.current = setUpOperator();
    return () => {
      sub.current.unsubscribe();
    };
  }, []);

  return (
    <Layout title="merge">
      <main>
        <h1>Merge</h1>
        <div className="demo">
          <svg className="animation" viewbox="0 0 800 300" width="100%" height="100%">
            <g transform="translate(150, 100)">
              <Stream
                data={tickA}
                x={0}
                y={0}
                width={200}
                height={20}
                onEmit={onAEmit}
                key="a"
              />
              <Stream
                data={tickB}
                x={0}
                y={30}
                width={200}
                height={20}
                onEmit={onBEmit}
                key="b"
              />
              <g transform="translate(200, -20)">
                <Operator width={90} height={90} tooltip="merge" />
                <Stream
                  data={tickC}
                  x={94}
                  y={30}
                  width={200}
                  height={20}
                  onEmit={onCEmit}
                  key="c"
                />
              </g>
            </g>
          </svg>
        </div>
        <div>
          <div>
            <Button type='reset' onClick={reset}>Reset</Button>
          </div>
          <div className="btn-group">
            <Button onClick={() => emit('a')}>Emit A</Button>
            <Button onClick={() => emit('b')}>Emit B</Button>
          </div>

        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
