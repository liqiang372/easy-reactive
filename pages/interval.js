import React from 'react';
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

  const onAEmit = (d) => {
    emit('a', { clearBefore: d });
  };

  return (
    <Layout title="interval">
      <main>
        <h1>interval</h1>
        <div className="demo">
          <svg className="animation">
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
                onComplete={() => {
                  emit('a');
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
