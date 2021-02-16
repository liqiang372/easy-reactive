import React, { memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cns from 'classnames';

export const SidePanel = memo(() => {
  const router = useRouter();
  const links = [
    'debounceTime',
    'map',
    'merge',
    'take',
    'concat',
    'race',
    'zip',
    'interval',
    'withLatestFrom',
    'combineLatest',
    'forkJoin',
    'mergeAll',
    'mergeMap',
    'switchMap',
  ].map((link) => {
    return (
      <li className="px-4 py-2 list-none" key={link}>
        <Link href={`/${link}`}>
          <a
            className={cns('text-gray-500', 'hover:text-gray-900', {
              'text-blue-400': router.pathname.substring(1) === link,
            })}
          >
            {link}
          </a>
        </Link>
      </li>
    );
  });
  return (
    <div className="fixed hidden h-full overflow-y-auto sidePanel lg:block" id="sidePanel">
      <ul className="flex flex-col px-4">{links}</ul>
      <style jsx>{`
        .sidePanel {
          width: 220px;
          box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.1);
          z-index: 100;
          background-color: white;
        }
        .sidePanel.open {
          display: block;
        }
      `}</style>
    </div>
  );
});
