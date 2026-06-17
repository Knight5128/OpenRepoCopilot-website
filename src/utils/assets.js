const normalizeBase = (base) => (base.endsWith("/") ? base : `${base}/`);

export function publicUrl(path) {
  const cleanPath = path.replace(/^\/+/, "");

  if (import.meta.env.PROD) {
    return new URL(`../${cleanPath}`, import.meta.url).href;
  }

  return `${normalizeBase(import.meta.env.BASE_URL)}${cleanPath}`;
}

export const LOGO_URL = publicUrl("assets/openrepo-copilot-logo.png");
export const HERO_KNOWLEDGE_GRAPH_URL = publicUrl("assets/hero-knowledge-graph.png");
export const WINDOWS_INSTALLER_URL = publicUrl("downloads/OpenRepoCopilot-Setup-20260617.exe");
