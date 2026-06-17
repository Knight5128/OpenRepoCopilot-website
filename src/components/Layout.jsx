import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ScrollProgress from "./ScrollProgress.jsx";

export default function Layout({ children, footerTagline }) {
  const { pathname } = useLocation();

  // Reset scroll on navigation so each page opens at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <ScrollProgress />
      <main>{children}</main>
      <Footer tagline={footerTagline} />
    </>
  );
}
