import { AppProps } from 'next/app';
import { InvoiceProvider } from '../context/InvoiceContext';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <InvoiceProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </InvoiceProvider>
  );
}

export default MyApp; 