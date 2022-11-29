import "../styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import AuthProvider from "@contexts/Auth";
import axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  Axios.defaults.withCredentials = true;
  return (
    <AuthProvider>
      <Component {...pageProps} />;
    </AuthProvider>
  );
}
