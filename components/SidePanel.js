import React, { memo } from 'react';
import Link from 'next/link';

export const SidePanel = memo(() => {
  return (
    <div className="container fixed h-full">
      <ul className="flex flex-col px-4">
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
          <Link href="/take">
            <a>take</a>
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
      <style jsx>{`
        .container {
          width: 220px;
          box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }
        li {
          list-style: none;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
});
