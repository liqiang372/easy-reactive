import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { Stream } from '../components/Stream';
import { Queue } from '../components/Queue';
import { Layout } from '../components/Layout';
import { Output } from '../components/Output';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Button } from '../components/Button';

const DOC = `
\`withLatestFrom\` will emit whatever emitted by a,
but also with the latest value from b. However, if it hasn't got
any value from b yet, then won't emit anything.
~~~js
a$.pipe(
  withLatestFrom(b$)
).subscribe(([a, b]) => {
  console.log(a, b);
})
~~~
`;

const a$ = new Subject();
const b$ = new Subject();

const INITIAL_QUEUE_STATE = {
  queueA: [],
  queueB: [],
  queueUpdateMode: undefined,
  outputA: undefined,
  outputB: undefined,
};

export default function WithLatestFrom() {
  const [emit, tickA, tickB] = useStream(2);
  const [{ queueA, queueB, queueUpdateMode, outputA, outputB }, setState] = useState(INITIAL_QUEUE_STATE);
  const sub = useRef(null);
  const setUpOperator = () => {
    return a$.pipe(withLatestFrom(b$)).subscribe(([a, b]) => {
      setState((prevState) => {
        return {
          ...prevState,
          outputA: a,
          outputB: b
        }
      })
    })
  };

  const updateQueue = (which, data) => {
    emit(which, { clearBefore: data });
    const stream$ = which === 'a' ? a$ : b$;
    stream$.next(data);
    const updateName = which === 'a' ? 'queueA' : 'queueB';

    setState((prevState) => {
      return {
        ...prevState,
        [updateName]: [data],
      };
    });
  };

  const reset = () => {
    d3.select('.animation').selectAll('*').interrupt();
    emit('reset');
    setState(INITIAL_QUEUE_STATE);
    if (sub.current) {
      sub.current.unsubscribe();
      sub.current = setUpOperator();
    }
  };

  useEffect(() => {
    sub.current = setUpOperator();
    return () => {
      sub.current.unsubscribe();
    };
  }, []);

  return (
    <Layout title="withLatestFrom">
      <main>
        <h1>withLatestFrom</h1>
        <div className="demo">
          <svg className="animation" viewbox="0 0 800 300" width="100%" height="100%">
            <g transform="translate(150, 100)">
              <Stream
                data={tickA}
                x={0}
                y={0}
                width={200}
                height={20}
                onEmit={(d) => updateQueue('a', d)}
                key="a"
              />
              <Stream
                data={tickB}
                x={0}
                y={30}
                width={200}
                height={20}
                onEmit={(d) => updateQueue('b', d)}
                key="b"
              />
              <g transform="translate(200, -20)">
                <Operator width={90} height={90} tooltip="combineLatest" />
                <Queue
                  className="queueA"
                  data={queueA}
                  x={10}
                  y={20}
                  mode={queueUpdateMode}
                  key="a"
                />
                <Queue
                  className="queueB"
                  data={queueB}
                  x={10}
                  y={50}
                  mode={queueUpdateMode}
                  key="b"
                />
              </g>
            </g>
          </svg>
          <div className="output-container">
            <Output width={100} height={50}>
              {outputA && outputB ? (
                <span>[{`${outputA.text}, ${outputB.text}`}]</span>
              ) : (
                  'Empty'
                )}
            </Output>
          </div>
        </div>
        <div>
          <div>
            <Button type="reset" onClick={reset}>Reset</Button>
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
