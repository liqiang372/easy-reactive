import React from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { Stream } from '../components/Stream';
import { Queue } from '../components/Queue';
import { Layout } from '../components/Layout';
import { Output } from '../components/Output';
import { Markdown } from '../components/Markdown';

const DOC = `
The name explains itself, \`withLatestFrom\` will emit whatever emitted by a,
but also with the latest value from b. However, if it hasn't got
any value from b yet, then won't emit anything.
~~~js
a$.withLatestFrom(b$).subscribe(([a, b]) => {
  console.log(a, b);
})
~~~
`
export default class CombineLatest extends React.Component {
  constructor(props) {
    super(props);
    this.a$ = new Subject();
    this.b$ = new Subject();
    this.state = {
      tickA: [],
      tickB: [],
      queueA: [],
      queueB: [],
      outputA: undefined,
      outputB: undefined,
      queueUpdateMode: undefined,
    };
    this.setUpOperator();
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  setUpOperator = () => {
    this.sub = this.a$.pipe(withLatestFrom(this.b$)).subscribe(([a, b]) => {
      this.setState({
        outputA: a,
        outputB: b,
      });
    });
  };

  emitA = () => {
    this.emit('a');
  };

  emitB = () => {
    this.emit('b');
  };

  emit = (label) => {
    const name = `tick${label.toUpperCase()}`;
    this.setState((prevState) => {
      let lastTick = prevState[name][prevState[name].length - 1];
      const lastKey = lastTick ? lastTick.key : -1;
      const key = lastKey + 1;
      return {
        [name]: prevState[name].concat({
          key,
          text: `${label}${key}`,
        }),
      };
    });
  };

  onAEmit = (d) => {
    this.setState(
      {
        queueA: [d],
      },
      () => {
        this.a$.next(d);
      }
    );
  };

  onBEmit = (d) => {
    this.setState(
      {
        queueB: [d],
      },
      () => {
        this.b$.next(d);
      }
    );
  };

  reset = () => {
    // cancel all running transitions
    d3.select('.animation').selectAll('*').interrupt();
    this.setState({
      tickA: [],
      tickB: [],
      queueA: [],
      queueB: [],
      outputA: undefined,
      outputB: undefined,
    });
    if (this.sub) {
      this.sub.unsubscribe();
      this.setUpOperator();
    }
  };

  render() {
    const {
      tickA,
      tickB,
      queueA,
      queueB,
      queueUpdateMode,
      outputA,
      outputB,
    } = this.state;
    return (
      <Layout title="withLatestFrom">
        <main>
          {' '}
          <h1>withLatestFrom</h1>
          <div className="demo">
            <svg className="animation">
              <g transform="translate(150, 100)">
                <Stream
                  data={tickA}
                  x={0}
                  y={0}
                  width={200}
                  height={20}
                  onEmit={this.onAEmit}
                  key="a"
                />
                <Stream
                  data={tickB}
                  x={0}
                  y={30}
                  width={200}
                  height={20}
                  onEmit={this.onBEmit}
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
            <button onClick={this.emitA}>Emit A</button>
            <button onClick={this.emitB}>Emit B</button>
            <button onClick={this.reset}>Reset</button>
          </div>
          <Markdown source={DOC} />
        </main>
        <style jsx>{`
          .output-container {
            position: absolute;
            top: 0;
            left: 500px;
          }
        `}</style>
      </Layout>
    );
  }
}
