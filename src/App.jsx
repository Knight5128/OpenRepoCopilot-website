import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Usage from "./pages/Usage.jsx";
import Architecture from "./pages/Architecture.jsx";
import Skills from "./pages/Skills.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
