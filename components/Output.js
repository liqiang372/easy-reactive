import React from 'react';
import Tippy from '@tippyjs/react';

export function Output({ children, width, height }) {
  const styles = {
    width: `${width}px`,
    height: `${height}px`,
  };
  return (
    <Tippy content="Output">
      <div className="output" style={styles}>
        {children}
        <style jsx>{`
          .output {
            position: relative;
            background-color: #f2f2f1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid black;
            box-shadow: 3px 3px;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </div>
    </Tippy>
  );
}
