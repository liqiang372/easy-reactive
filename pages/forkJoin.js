import React from 'react';
import * as d3 from 'd3';
import { Operator } from '../components/Operator';
import { Subject, forkJoin } from 'rxjs';
import { Stream } from '../components/Stream';
import { Queue } from '../components/Queue';
import { Layout } from '../components/Layout';
import { Output } from '../components/Output';
import { Markdown } from '../components/Markdown';

const DOC = `
\`forkJoin\` only emits all values once all streams complete
~~~js
forkJoin(a$, b$).subscrine([a, b] => {
  console.log(a, b);
})
~~~
`
export default class ForkJoin extends React.Component {
  constructor(props) {
    super(props);
    this.doc = undefined;
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

  setUpOperator = () => {
    this.sub = forkJoin(this.a$, this.b$).subscribe(([a, b]) => {
      console.log(a, b)
      setTimeout(() => {
        const selectionA = d3.select('.queueA g')
        const selectionB = d3.select('.queueB g')
          ;[selectionA, selectionB].forEach((selection, index) => {
            selection
              .select('rect')
              .style('fill', 'yellow')
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
                      this.setState({
                        outputA: a,
                        outputB: b,
                      })
                    }
                  })
              })
          })
      })
    })
  }

  emitA = () => {
    this.emit('a')
  }

  emitAComplete = () => {
    this.emit('a', { complete: true })
  }

  emitB = () => {
    this.emit('b')
  }

  emitBComplete = () => {
    this.emit('b', { complete: true })
  }

  emit = (label, options = {}) => {
    const name = `tick${label.toUpperCase()}`
    this.setState(prevState => {
      let lastTick = prevState[name][prevState[name].length - 1]
      const lastKey = lastTick ? lastTick.key : -1
      const lastText = lastTick && lastTick.text
      if (lastText === 'C') {
        // If this already complete, then shouldn't allow emit more value
        return
      }
      const key = lastKey + 1
      let text = `${label}${key}`
      if (options.complete) {
        text = `C`
      }
      return {
        [name]: prevState[name].concat({
          key,
          text,
        }),
      }
    })
  }

  onAEmit = d => {
    if (d.text === 'C') {
      this.a$.complete()
    } else {
      this.setState(
        {
          queueA: [d],
        },
        () => {
          this.a$.next(d)
        }
      )
    }
  }

  onBEmit = d => {
    if (d.text === 'C') {
      this.b$.complete()
    } else {
      this.setState(
        {
          queueB: [d],
        },
        () => {
          this.b$.next(d)
        }
      )
    }
  }

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
    })

    this.a$ = new Subject()
    this.b$ = new Subject()
    if (this.sub) {
      this.sub.unsubscribe()
      this.setUpOperator()
    }
  }

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
      <Layout title="forkJoin">
        <main>
          <h1>forkJoin</h1>
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
            <button onClick={this.emitAComplete}>Emit A Complete</button>
            <button onClick={this.emitB}>Emit B</button>
            <button onClick={this.emitBComplete}>Emit B Complete</button>
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
