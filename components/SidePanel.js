import React, { memo } from 'react';
import Link from 'next/link';

export const SidePanel = memo(() => {
  return (
    <div className="container">
      <ul>
        <li>
          <Link href="/">Home page</Link>
        </li>
        <li>
          <Link href="/debounceTime">
            <a>debounceTime</a>
          </Link>
        </li>
        <li>
          <Link href="/map">
            <a>map</a>
          </Link>
        </li>
        <li>
          <Link href="/merge">
            <a>merge</a>
          </Link>
        </li>
        <li>
          <Link href="/concat">
            <a>concat</a>
          </Link>
        </li>
        <li>
          <Link href="/zip">
            <a>zip</a>
          </Link>
        </li>
        <li>
          <Link href="/withLatestFrom">
            <a>withLatestFrom</a>
          </Link>
        </li>
        <li>
          <Link href="/combineLatest">
            <a>combineLatest</a>
          </Link>
        </li>
        <li>
          <Link href="/forkJoin">
            <a>forkJoin</a>
          </Link>
        </li>
      </ul>
      <div className="github">
        <a href="https://github.com/liqiang372/easy-reactive" target="_blank">
          Github
        </a>
      </div>
      <style jsx>{`
        .container {
          position: relative;
          width: 260px;
          box-shadow: 6px 0 6px rgba(0, 0, 0, 0.1);
        }
        ul {
          display: flex;
          flex-direction: column;
        }
        li {
          list-style: none;
          margin-top: 1rem;
        }

        .github {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
});
