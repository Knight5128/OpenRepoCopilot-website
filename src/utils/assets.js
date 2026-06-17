export function publicUrl(path) {
  const cleanPath = path.replace(/^\/+/, "");
  return `/${cleanPath}`;
}

export const LOGO_URL = publicUrl("assets/openrepo-copilot-logo.png");
export const HERO_KNOWLEDGE_GRAPH_URL = publicUrl("assets/hero-knowledge-graph.png");
export const WINDOWS_INSTALLER_URL = publicUrl("downloads/OpenRepoCopilot-Setup-20260617.exe");
