import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";

const iranSansFont = localFont({
  variable: "--font-iransans",
  preload: true,

  display: "swap",
  adjustFontFallback: "Arial",
  src: [
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/iransans/woff2/IRANSansXFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={iranSansFont.className}>
      <Component {...pageProps} />
    </div>
  );
}
