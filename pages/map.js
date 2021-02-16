import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Gear } from '../components/Gear';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '../components/Button';

const DOC = `
~~~js
a$.pipe(
  map((a) => ('b' + a.substring(1)))
).subscribe((b) => {
  console.log(b);
})
~~~
`;
const INITIAL_STATE = {
  rotate: false
}

export default function Map() {
  const [emit, tickA, tickB] = useStream(2);
  const [{ rotate }, setState] = useState(INITIAL_STATE);

  const reset = () => {
    d3.select('.animation').selectAll('*').interrupt();
    setState(INITIAL_STATE);
    emit('reset');

  };

  const setRotateDebounced = useDebouncedCallback(() => {
    setState({
      rotate: false
    })
  }, 1000)

  const onAEmit = useCallback((d) => {
    setState({
      rotate: true,
    });
    emit('a', { clearBefore: d })
    setRotateDebounced.callback();
    setTimeout(() => {
      emit('b');
    }, 1000);
  }, [emit]);

  const onBEmit = useCallback((d) => {
    emit('b', { clearBefore: d })
  })

  return (
    <Layout title="map">
      <main>
        <h1>map</h1>
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
                <Operator width={90} height={90} tooltip="map" />
                <Gear x={24} y={24} rotate={rotate} />
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
          <Button type="emit" onClick={() => emit('a')}>Emit A</Button>
          {/* <button onClick={reset}>Reset</button> */}
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
