import React, { memo } from 'react';
import Link from 'next/link';

export const SidePanel = memo(() => {
  const links = [
    'debounceTime',
    'map',
    'merge',
    'take',
    'concat',
    'race',
    'zip',
    'withLatestFrom',
    'combineLatest',
    'forkJoin',
    'mergeAll',
  ].map((link) => {
    return (
      <li className="my-2 list-none" key={link}>
        <Link href={`/${link}`}>
          <a>{link}</a>
        </Link>
      </li>
    )
  })
  return (
    <div className="container fixed h-full">
      <ul className="flex flex-col px-4">
        {links}
      </ul>
      <style jsx>{`
        .container {
          width: 220px;
          box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }
      `}</style>
    </div>
  );
});
