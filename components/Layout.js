import React from 'react';
import { SidePanel } from './SidePanel';
import { Navbar } from './NavBar';
import Head from 'next/head';

export function Layout({ title, children }) {
  var pageTitle = (title ? `${title} - ` : '') + 'Easy Reactive';
  return (
    <div className="flex flex-col w-full min-h-screen mx-auto max-w-8xl">
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex flex-auto">
        <SidePanel />
        {children}
      </div>
    </div>
  );
}
