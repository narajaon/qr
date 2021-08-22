import 'tailwindcss/tailwind.css';
import '@styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProps } from 'next/app';

// Create a client
const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
