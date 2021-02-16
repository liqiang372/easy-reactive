import React, { useState } from 'react';
import { Stream } from '../components/Stream';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { useStream } from '../hooks/useStream';
import { Timer } from '../components/Timer';

const DOC = `
~~~js
import { interval } from 'rxjs';

// Emit a value every 4 seconds
interval(4000).subscribe((x) => {
  console.log(x);
})
~~~
`;

export default function Map() {
  const [emit, tickA] = useStream(2);
  const [ticks, setTicks] = useState([{key: 1, value: 1}]);

  const onAEmit = (d) => {
    emit('a', { clearBefore: d });
  };

  return (
    <Layout title="interval">
      <main>
        <h1>interval</h1>
        <div className="demo">
          <svg className="animation" viewbox="0 0 800 300" width="100%" height="100%">
            <g transform="translate(150, 100)">
              <Stream
                data={tickA}
                x={50}
                y={-10}
                width={150}
                height={20}
                onEmit={onAEmit}
              />
              <Timer
                ticks={ticks}
                onComplete={() => {
                  emit('a');
                  setTicks((prevState) => {
                    return [{key: (prevState[0].key + 1) % 2, value: 1}]
                  })
                }}
              />
            </g>
          </svg>
        </div>
        <Markdown source={DOC} />
      </main>
    </Layout>
  );
}
