import React from 'react';
import Link from 'next/link';

export function SidePanel() {
  return (
    <div className="container">
      <ul>
        <li>
          <Link href="/">Home page</Link>
        </li>
        <li>
          <Link href="/debounceTime">
            <a>DebounceTime</a>
          </Link>
        </li>
        <li>
          <Link href="/zip">
            <a>Zip</a>
          </Link>
        </li>
        <li>
          <Link href="/withLatestFrom">
            <a>WithLatestFrom</a>
          </Link>
        </li>
        <li>
          <Link href="/combineLatest">
            <a>CombineLatest</a>
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
}
