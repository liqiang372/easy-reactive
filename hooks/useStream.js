import { useState } from 'react';
export function useStream(numOfStreams) {
  const [tickList, updateTickList] = useState(
    Array(numOfStreams)
      .fill(0)
      .map(() => [])
  );

  const emit = (
    label,
    options = { complete: false, valueToEmit: undefined }
  ) => {
    if (label === 'reset') {
      updateTickList(
        Array(tickList.length)
          .fill(0)
          .map(() => [])
      );
      return;
    }

    const index = label.charCodeAt(0) - 'a'.charCodeAt(0);
    updateTickList((prevState) => {
      return prevState.map((ticks, i) => {
        if (i === index) {
          if (options.clearBefore !== undefined) {
            const index = ticks.findIndex(
              (tick) => tick.key === options.clearBefore.key
            );
            return ticks.slice(index);
          } else if (options.valueToEmit !== undefined) {
            return ticks.concat(options.valueToEmit);
          } else {
            const lastTick = ticks[ticks.length - 1];
            const lastKey = lastTick ? lastTick.key : `${label}_${-1}`;
            const lastText = lastTick && lastTick.text;
            if (lastText === 'C') {
              return ticks;
            }
            const curIndex = Number(lastKey.split('_')[1]) + 1;
            const key = `${label}_${curIndex}`;
            const text = options.complete ? 'C' : `${label}${curIndex}`;
            return ticks.concat([
              {
                key,
                text,
              },
            ]);
          }
        }
        return ticks;
      });
    });
  };
  return [emit, ...tickList.slice(0, numOfStreams)];
}
