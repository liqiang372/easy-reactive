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
      </ul>
      <style jsx>{`
        .container {
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
      `}</style>
    </div>
  );
}
