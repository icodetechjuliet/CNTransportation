const CargoNetClaudeConfig = {
  // Fetched at module-load time — if this origin isn't allowed by that
  // endpoint's CORS policy (e.g. localhost during local dev, where only
  // the production origin is likely allow-listed) or the endpoint is
  // otherwise unreachable, this must not become an unhandled promise
  // rejection; AI-dependent features just won't have a token available.
  AI_TOKEN: fetch("https://b1.gocargonet.com/claude-key/claude-key.txt")
    .then((response) => response.text())
    .catch((err) => {
      console.error("CargoNetClaudeConfig: failed to load AI_TOKEN", err);
      return null;
    }),
};

export default CargoNetClaudeConfig;
