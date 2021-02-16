import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject, race } from 'rxjs';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Button } from '../components/Button';
import { getActiveStreamProps } from '../utils';

const DOC = `
\`race\` subscribes to all source observables, once one of source observables emits first. It will unsubscribe from other sources,
and then becomes of a mirror of the one observable remained.
`;

let a$ = new Subject();
let b$ = new Subject();
let c$ = new Subject();

const INITIAL_QUEUE_STATE = {
  activeStreams: ['a', 'b', 'c']
};

export default function Concat() {
  const [emit, tickA, tickB, tickC, tickD] = useStream(4);
  const [{ activeStreams }, setState] = useState(INITIAL_QUEUE_STATE);
  const sub = useRef(null);
  const setUpOperator = () => {
    return race(a$, b$, c$).subscribe((x) => {
      const label = x.key.split('_')[0];
      setState((prevState) => {
        return {
          ...prevState,
          activeStreams: [label]
        }
      })
      emit('d', { valueToEmit: x })
    })
  };

  const onEmit = (which, data) => {
    emit(which, { clearBefore: data });
    const stream$ = which === 'a' ? a$ : which === 'b' ? b$ : c$;
    stream$.next(data);
  };
  const onDEmit = useCallback((d) => {
    emit('d', { clearBefore: d })
  })

  const reset = () => {
    d3.select('.animation').selectAll('*').interrupt();
    emit('reset');
    setState(INITIAL_QUEUE_STATE);
    if (sub.current) {
      a$ = new Subject();
      b$ = new Subject();
      c$ = new Subject();
      sub.current.unsubscribe();
      sub.current = setUpOperator();
    }
  };

  useEffect(() => {
    sub.current = setUpOperator();
    return () => {
      sub.current.unsubscribe();
    };
  }, [])

  return (
    <Layout title="race">
      <main>
        <h1>race</h1>
        <div className="demo">
          <svg className="animation" viewBox="0 0 800 300" width="100%" height="100%">
            <g transform="translate(150, 100)">
              <Stream
                data={tickA}
                x={0}
                y={0}
                width={200}
                height={20}
                onEmit={(d) => onEmit('a', d)}
                {...getActiveStreamProps(activeStreams.includes('a'))}
                fill={undefined}
                key="a"
              />
              <Stream
                data={tickB}
                x={0}
                y={30}
                width={200}
                height={20}
                onEmit={(d) => onEmit('b', d)}
                {...getActiveStreamProps(activeStreams.includes('b'))}
                fill={undefined}
                key="b"
              />
              <Stream
                data={tickC}
                x={0}
                y={60}
                width={200}
                height={20}
                onEmit={(d) => onEmit('c', d)}
                {...getActiveStreamProps(activeStreams.includes('c'))}
                fill={undefined}
                key="c"
              />
              <g transform="translate(200, -20)">
                <Operator width={120} height={120} tooltip="race" />
                <Stream
                  data={tickD}
                  x={124}
                  y={50}
                  width={200}
                  height={20}
                  onEmit={onDEmit}
                  key="c"
                />
              </g>
            </g>
          </svg>
        </div>
        <div>
          <div>
            <Button type="reset" onClick={reset}>Reset</Button>
          </div>
          <div className="btn-group">
            <Button onClick={() => emit('a')}>Emit A</Button>
            <Button onClick={() => emit('b')}>Emit B</Button>
            <Button onClick={() => emit('c')}>Emit C</Button>
          </div>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
