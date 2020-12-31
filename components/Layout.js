import React from 'react';
import { SidePanel } from './SidePanel';
import Head from 'next/head';

export function Layout({ title, children }) {
  var pageTitle = (title ? `${title} - ` : '') + 'Easy Reacative';
  return (
    <div className="page">
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SidePanel />
      {children}
      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
        }
      `}</style>
    </div>
  );
}
