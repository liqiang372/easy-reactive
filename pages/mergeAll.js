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
Let's forget about observable for now, and revisit the data structure we use everyday: Array.

say, I have an array,

~~~js
[1, 2, 3] // these are just numbers wrapped in a context, and this context happens to be Array.
~~~

and I can use \`map\` to transform the element into another element, for example I can multiple each element by 2

~~~js
[1, 2, 3].map((x) => 2 * x)
// [2, 4, 6], so we have new numbers still in the context: Array
~~~

I can chain other methods on this context too, as these methods will be evaluated on the elements in the context

~~~js
[1, 2, 3]
  .map((x) => 2 * x)
  .filter((x) => x > 4)
~~~

Here's the interesting part, what if the returned value is another context (another array)

~~~js
[1, 2, 3].map((x) => [2 * x])

// [[2], [4], [3]]
~~~

Can I still chain \`filter\` after this \`map\`?

~~~js
[1, 2, 3].map((x) => [2 * x])
  .filter((x) => x > 4) // what is x here?
~~~

The \`x\` here is actually the element which is another element in context(Array), aka, Higher Order Array(or Nested Array).

in order to use following chaining methods on the context, we need to extract the element inside the nested brackets. Javascript
happens to have a method called [flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) to do this job

~~~js
[1, 2, 3]
  .map((x) => [2 * x])
  .flat()

// [2, 4, 3]
~~~

And we can happily to \`filter\` again!

~~~js
[1, 2, 3]
  .map((x) => [2 * x])
  .flat()
  .filter((x) => x > 4)
~~~

If you understand what \`flat\` does in Array, then you alredy knows the role of \`mergeAll\`.

In the context of Observable, we have a method called \`mergeAll\` equivalent to \`flat\` in the context of Array. 
It is usually used togher with \`map\`, where here \`map\` returns a new context(new Observable)

~~~js
of(1, 2, 3).pipe(
  map((x) => of(2 * x)), // returns a new Observable
  mergeAll(),
  filter((x) => x > 4)
)
~~~

And since \`map\` + \`mergeAll\` is a so common combination, we have [mergeMap](http://easyreactive.com/mergeMap) to simplify operators.

`;

const a$ = new Subject();
const b$ = new Subject();

export default function MergeAll() {
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
    <Layout title="mergeAll">
      <main>
        <h1>mergeAll</h1>
        {null && <><div className="demo">
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
            <div>
              <Button type='reset' onClick={reset}>Reset</Button>
            </div>
            <div className="btn-group">
              <Button onClick={() => emit('a')}>Emit A</Button>
              <Button onClick={() => emit('b')}>Emit B</Button>
            </div>

          </div></>}
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
