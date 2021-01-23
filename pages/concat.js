import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject, concat } from 'rxjs';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { COLORS } from '../constants';
import { Button } from '../components/Button';

const DOC = `
\`concat\` will subscribe the observable one by one. It won't subscribe next one until current one is completed.

Following is a typical example

~~~js
// When a$ is subscribed, emit a value every 1 second, and emit 4 values in total.
// 0----1s---- a1 ----1s---- a2 ----1s---- a3 ----1s---- a4|
const a$ = interval(1000).pipe(
  map((x) => 'a' + x),
  take(4)
);
// When b$ is subscribed, emit a value every 200ms, and emit 2 values in total
// 0----200ms---- b1 ----200ms---- b2|
const b$ = interval(100).pipe(
  map((x) => 'b' + x)
  take(2)
)

// The result of following is 
// 0----1s---- a1 ----1s---- a2 ----1s---- a3 ----1s---- a4 ----200ms---- b1 ----200ms---- b2|
concat(a$, b$).subscribe((x) => {
  console.log(x)
})
~~~

Also note that if you use \`Subject\` as Observable. Before a$ is completed, any value emitted via \`b$.next\` will not be
passed to concat as the subject is not subscribed yet. If you do want to output all values including the ones before subscribed,
consider using \`BehaviorSubject\` or \`ReplaySubject\`
`;

let a$ = new Subject();
let b$ = new Subject();
let c$ = new Subject();

const INITIAL_QUEUE_STATE = {
  activeStream: 'a'
};

export default function Concat() {
  const [emit, tickA, tickB, tickC, tickD] = useStream(4);
  const [{ activeStream }, setState] = useState(INITIAL_QUEUE_STATE);
  const sub = useRef(null);
  const setUpOperator = () => {
    return concat(a$, b$, c$).subscribe((x) => {
      emit('d', { valueToEmit: x })
    })
  };

  const onEmit = (which, data) => {
    emit(which, { clearBefore: data });
    const stream$ = which === 'a' ? a$ : which === 'b' ? b$ : c$;
    if (data.text === 'C') {
      stream$.complete();
      // if which is not the last, then we increment the activeStream by 1 
      if (which !== 'c') {
        setState((prevState) => {
          return {
            ...prevState,
            activeStream: String.fromCharCode(prevState.activeStream.charCodeAt(0) + 1)
          }
        })
      }
    } else {
      stream$.next(data);
    }
  };
  const onDEmit = useCallback((d) => {
    emit('d', { clearBefore: d })
  })

  const getActiveStreamProps = useCallback((which) => {
    if (which === activeStream) {
      return {
        fill: COLORS.PURPLE_1,
        x: 0
      };
    }
    return {
      x: -10
    };
  }, [activeStream])

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
    <Layout title="concat">
      <main>
        <h1>concat</h1>
        <div className="demo">
          <svg className="animation">
            <g transform="translate(150, 100)">
              <Stream
                data={tickA}
                x={0}
                y={0}
                width={200}
                height={20}
                onEmit={(d) => onEmit('a', d)}
                {...getActiveStreamProps('a')}
                key="a"
              />
              <Stream
                data={tickB}
                x={0}
                y={30}
                width={200}
                height={20}
                onEmit={(d) => onEmit('b', d)}
                {...getActiveStreamProps('b')}
                key="b"
              />
              <Stream
                data={tickC}
                x={0}
                y={60}
                width={200}
                height={20}
                onEmit={(d) => onEmit('c', d)}
                {...getActiveStreamProps('c')}
                key="c"
              />
              <g transform="translate(200, -20)">
                <Operator width={120} height={120} tooltip="concat" />
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
            <Button onClick={() => emit('a', { complete: true })} type="complete">Complete A</Button>
          </div>
          <div className="btn-group">
            <Button onClick={() => emit('b')}>Emit B</Button>
            <Button onClick={() => emit('b', { complete: true })} type="complete">Complete B</Button>
          </div>
          <div className="btn-group">
            <Button onClick={() => emit('c')}>Emit C</Button>
            <Button onClick={() => emit('c', { complete: true })} type="complete">Complete C</Button>
          </div>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
