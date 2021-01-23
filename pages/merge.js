import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Gear } from '../components/Gear';
import { useDebouncedCallback } from 'use-debounce';

const DOC = `
~~~js
merge(a$, b$).subscribe((x) => {
  console.log(x);
})
~~~
`;

const a$ = new Subject();
const b$ = new Subject();

const INITIAL_STATE = {
  rotate: false
}

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
          <svg className="animation">
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
          <button onClick={() => emit('a')}>Emit A</button>
          <button onClick={() => emit('b')}>Emit B</button>
          <button onClick={reset}>Reset</button>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
