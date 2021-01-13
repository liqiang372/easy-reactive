import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject, zip } from 'rxjs';
import { Stream } from '../components/Stream';
import { Queue } from '../components/Queue';
import { Layout } from '../components/Layout';
import { Output } from '../components/Output';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';

const DOC = `
Zip is like one assembly station, one patty and one bread must both be ready to go
~~~js
zip(a$, b$).subscribe(([a, b]) => {
  console.log(a, b)
});
~~~
`;
const a$ = new Subject();
const b$ = new Subject();

const INITIAL_QUEUE_STATE = {
  queueA: [],
  queueB: [],
  zipQueue: [],
  queueUpdateMode: undefined,
  outputA: undefined,
  outputB: undefined,
};

export default function Zip() {
  const [emit, tickA, tickB] = useStream(2);
  const [
    { queueA, queueB, zipQueue, queueUpdateMode, outputA, outputB },
    setState,
  ] = useState(INITIAL_QUEUE_STATE);
  const sub = useRef(null);
  const isPullingFromZip = useRef(false);

  const setUpOperator = () => {
    return zip(a$, b$).subscribe(([a, b]) => {
      setState((prevState) => {
        return {
          ...prevState,
          zipQueue: prevState.zipQueue.concat([[a, b]]),
        };
      });
    });
  };

  const updateQueue = (which, data) => {
    const stream$ = which === 'a' ? a$ : b$;
    stream$.next(data);
    const updateName = which === 'a' ? 'queueA' : 'queueB';

    setState((prevState) => {
      return {
        ...prevState,
        [updateName]: prevState[updateName].concat(data),
        queueUpdateMode: 'enter',
      };
    });
  };

  const reset = () => {
    d3.select('.animation').selectAll('*').interrupt();
    emit('reset');
    setState(INITIAL_QUEUE_STATE);
    isPullingFromZip.current = false;
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

  useEffect(() => {
    if (!isPullingFromZip.current && zipQueue.length > 0) {
      isPullingFromZip.current = true;
      const [a, b] = zipQueue[0];
      setTimeout(() => {
        const selectionA = d3.select('.queueA g');
        const selectionB = d3.select('.queueB g');
        [selectionA, selectionB].forEach((selection, index) => {
          selection
            .select('rect')
            .style('fill', '#fae560')
            .transition()
            .delay(500)
            .on('end', () => {
              selection
                .transition()
                .ease(d3.easeLinear)
                .duration(500)
                .style('transform', 'translateY(80px)')
                .on('end', () => {
                  if (index === 0) {
                    isPullingFromZip.current = false;
                    setState((prevState) => {
                      return {
                        ...prevState,
                        queueA: prevState.queueA.filter((d) => d.key !== a.key),
                        queueB: prevState.queueB.filter((d) => d.key !== b.key),
                        queueUpdateMode: undefined,
                        zipQueue: prevState.zipQueue.slice(1),
                        outputA: a,
                        outputB: b,
                      };
                    });
                  }
                });
            });
        });
      });
    }
  }, [zipQueue]);

  return (
    <Layout>
      <main>
        <h1>Zip</h1>
        <div className="demo">
          <svg className="animation">
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
                <Operator width={90} height={90} tooltip="zip" />
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
          <button onClick={() => emit('a')}>Emit A</button>
          <button onClick={() => emit('b')}>Emit B</button>
          <button onClick={reset}>Reset</button>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
