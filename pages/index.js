import { Layout } from '../components/Layout';

export default function Home() {
  return (
    <div className="page">
      <Layout>
        <main>
          <div>
            <h1 className="title">
              Welcome to Easy Reactive
            </h1>
            <p>Reactive pattern has never been so easy</p>
          </div>
        </main>
      </Layout>

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
