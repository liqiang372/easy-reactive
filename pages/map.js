import React, { useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';

const DOC = `
~~~js
a$.pipe(
  map((a) => ('b' + a.substring(1)))
).subscribe((b) => {
  console.log(b);
})
~~~
`;

const a$ = new Subject();


export default function Map() {
  const [emit, tickA, tickB] = useStream(2);
  const sub = useRef(null);
  const setUpOperator = () => {
    return a$.pipe(
      map((a) => (`b${a.substring(1)}`))
    ).subscribe((b) => {
      // console.log(b);
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
    emit('a', { itemToDelete: d })
    setTimeout(() => {
      emit('b');
    }, 1000)
  }, [emit]);

  const onBEmit = useCallback((d) => {
    emit('b', { itemToDelete: d })
  })

  useEffect(() => {
    sub.current = setUpOperator();
    return () => {
      sub.current.unsubscribe();
    };
  }, []);

  return (
    <Layout title="map">
      <main>
        <h1>map</h1>
        <div className="demo">
          <svg className="animation">
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
                <Operator width={90} height={90} tooltip="map" />
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
          <button onClick={() => emit('a')}>Emit A</button>
          <button onClick={reset}>Reset</button>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
