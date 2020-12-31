import Head from 'next/head';
import { SidePanel } from '../components/SidePanel';

export default function Home() {
  return (
    <div className="page">
      <Head>
        <title>Easy Reactive</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SidePanel />
      <main>
        <div>
          <h1 className="title">
            <a>Welcome to Easy Reactive</a>
          </h1>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{``}</style>
    </div>
  );
}
