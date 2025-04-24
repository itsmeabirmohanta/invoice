import Head from 'next/head';
import InvoiceBuilder from '../components/InvoiceBuilder';

export default function Home() {
  return (
    <>
      <Head>
        <title>Invoice Simple</title>
        <meta name="description" content="Simple invoice generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <InvoiceBuilder />
      </main>
    </>
  );
} 