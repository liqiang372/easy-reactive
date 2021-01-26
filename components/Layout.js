import React from 'react';
import { SidePanel } from './SidePanel';
import { Navbar } from './NavBar';
import Head from 'next/head';

export function Layout({ title, children }) {
  var pageTitle = (title ? `${title} - ` : '') + 'Easy Reacative';
  return (
    <div className="flex flex-col min-h-screen w-full max-w-8xl mx-auto">
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex-auto">
        <SidePanel />
        {children}
      </div>
    </div>
  );
}
