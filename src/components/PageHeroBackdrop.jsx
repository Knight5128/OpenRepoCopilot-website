import { HERO_KNOWLEDGE_GRAPH_URL } from "../utils/assets.js";

export default function PageHeroBackdrop() {
  return (
    <img
      className="page-hero-bg"
      src={HERO_KNOWLEDGE_GRAPH_URL}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
}
