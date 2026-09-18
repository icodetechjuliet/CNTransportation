const CargoNetAIConfig = {
  AI_URL: "https://api.openai.com/v1/chat/completions",
  // Injected at build time from OPENAI_API_KEY (see quasar.config.js build.env
  // and .env.example) — never hardcode the key here.
  AI_TOKEN: process.env.OPENAI_API_KEY,
};

export default CargoNetAIConfig;
