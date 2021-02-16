import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Button } from '../components/Button';
import { getActiveStreamProps } from '../utils';

const DOC = `
~~~js
a$.pipe(
  take(3)
).subscribe((b) => {
  console.log(b);
})
~~~
`;

const TAKE_COUNT = 3;
const INITIAL_STATE = {
  activeStream: 'a',
  takeCount: TAKE_COUNT,
}

export default function Take() {
  const [emit, tickA, tickB] = useStream(2);
  const [{ activeStream, takeCount }, setState] = useState(INITIAL_STATE);
  const countRef = useRef(TAKE_COUNT);

  const reset = () => {
    d3.select('.animation').selectAll('*').interrupt();
    setState(INITIAL_STATE);
    emit('reset');
    countRef.current = TAKE_COUNT;

  };

  const onAEmit = useCallback((d) => {
    emit('a', { clearBefore: d })
    if (countRef.current >= 1) {
      emit('b', { valueToEmit: d });
      countRef.current -= 1;
      setState((prevState) => {
        return {
          ...prevState,
          activeStream: countRef.current === 0 ? undefined : prevState.activeStream,
          takeCount: countRef.current
        }
      })
    }

  }, [emit, takeCount, activeStream]);

  const onBEmit = useCallback((d) => {
    emit('b', { clearBefore: d })
  })

  return (
    <Layout title="take">
      <main>
        <h1>take</h1>
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
                {...getActiveStreamProps('a' === activeStream)}
              />
              <g transform="translate(150, -20)">
                <Operator width={90} height={90} tooltip="take" />
                <text x="38" y="50" style={{ fontSize: '24px' }}>{takeCount}</text>
              </g>
              <Stream
                data={tickB}
                x={244}
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
          <div>
            <Button type="reset" onClick={reset}>Reset</Button>
          </div>
          <div className="btn-group">
            <Button onClick={() => emit('a')}>Emit A</Button>
          </div>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
