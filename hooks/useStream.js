import { useState } from 'react';
export function useStream(numOfStreams) {
  const [tickList, updateTickList] = useState(
    Array(numOfStreams)
      .fill(0)
      .map(() => [])
  );

  const emit = (label, options = { complete: false }) => {
    if (label === 'reset') {
      updateTickList(
        Array(tickList.length)
          .fill(0)
          .map(() => [])
      );
    }
    const index = label.charCodeAt(0) - 'a'.charCodeAt(0);
    updateTickList((prevState) => {
      return prevState.map((ticks, i) => {
        if (i === index) {
          const lastTick = ticks[ticks.length - 1];
          const lastKey = lastTick ? lastTick.key : -1;
          const lastText = lastTick && lastTick.text;
          if (lastText === 'C') {
            return ticks;
          }
          const key = lastKey + 1;
          const text = options.complete ? 'C' : `${label}${key}`;
          return ticks.concat([
            {
              key,
              text
            },
          ]);
        }
        return ticks;
      });
    });
  };
  return [emit, ...tickList.slice(0, numOfStreams)];
}
