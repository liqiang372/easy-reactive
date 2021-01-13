import { useState } from 'react';
export function useStream(numOfStreams) {
  const [tickList, updateTickList] = useState(
    Array(numOfStreams)
      .fill(0)
      .map(() => [])
  );

  const emit = (label) => {
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
          const key = lastKey + 1;
          return ticks.concat([
            {
              key,
              text: `${label}${key}`,
            },
          ]);
        }
        return ticks;
      });
    });
  };
  return [emit, ...tickList.slice(0, numOfStreams)];
}
