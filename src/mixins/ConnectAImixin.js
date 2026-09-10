import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import CargoNetAIConfig from "/src/IPConfig/configAI.js";
export const ConnectAImixin = {
  data() {
    return {
      prompt: "",
      suggestion: null,
      error: "",
    };
  },
  methods: {
    generatePrompt() {
      this.showLoading();
      const parts = [];

      if (this.CmpAddress) parts.push(`Address: ${this.CmpAddress}`);
      if (this.TXTCity) parts.push(`City: ${this.TXTCity}`);
      if (this.TXTState) parts.push(`State: ${this.TXTState.label}`);
      if (this.TXTCountry) parts.push(`Country: ${this.TXTCountry.label}`);
      if (this.TXTZipCode) parts.push(`Zipcode: ${this.TXTZipCode}`);

      this.prompt = `You are given address details which may be incorrect or incomplete.

Your tasks:
1. Validate and fix any mistakes (like invalid zip codes, misspelled state names, etc.).
2. Ensure that the **city is the correct district corresponding to the provided locality and zip code**.
3. Return a JSON object with the following keys:

- **area**: A complete and corrected address string starting from Door No (if present), followed by locality, city (as district), state, country, and zip.
- **city**: The district name (not the city/town name if different).
- **state**
- **country**
- **zipcode**
- **currencyCode**: Standard 3-letter ISO currency code (e.g., INR, USD) based on the country.

If any correction or assumption is made, include a "note" field explaining the changes.

Input:
${parts.join("\n")}

Respond only with valid JSON:`;

      if (this.prompt) {
        this.getSuggestion();
      }
    },
    async getSuggestion() {

      this.error = "";
      this.suggestion = null;
      const URL = CargoNetAIConfig.AI_URL;
      const TOKEN = CargoNetAIConfig.AI_TOKEN;
      try {
        const response = await fetch(CargoNetAIConfig.AI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CargoNetAIConfig.AI_TOKEN}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: this.prompt }],
            temperature: 0.3,
          }),
        });

        const data = await response.json();

        const content = data.choices?.[0]?.message?.content;
        const parsed = JSON.parse(content);

        if (
          parsed &&
          parsed.city &&
          parsed.state &&
          parsed.country &&
          parsed.zipcode
        ) {
          this.suggestion = parsed;
          console.log("AI suggestion:", this.suggestion);
          this.CmpAddress = this.suggestion.area || "";
          this.TXTCity = this.suggestion.city || "";
          this.TXTState = this.opState.find((option) =>
            option.label
              .toLowerCase()
              .includes(this.suggestion.state.toLowerCase())
          );
          if (this.TXTState) {
            this.TXTState = {
              label: this.TXTState.label,
              value: this.TXTState.value,
            };
          } else {
          }
          this.TXTCountry = this.opCountry.find(
            (option) =>
              option.label.toLowerCase() ===
              this.suggestion.country.toLowerCase()
          );
          if (this.TXTCountry) {
            this.TXTCountry = {
              label: this.TXTCountry.label,
              value: this.TXTCountry.value,
            };
          } else {
          }
          this.Defaultcurrency = this.filterCurrency.find(
            (option) => option.label === this.suggestion.currencyCode
          );

          if (this.Defaultcurrency) {
            this.Defaultcurrency = {
              label: this.Defaultcurrency.label,
              value: this.Defaultcurrency.value,
            };
          } else {
          }
          this.TXTZipCode = this.suggestion.zipcode || "";
          this.hideloading();
          this.showAISuggestion = false;
        } else {
          this.error = "AI could not extract a valid location.";
        }
      } catch (err) {
        console.error("AI error:", err);
        this.error = "Error fetching suggestion.";
      } finally {
      }
    },
  },
};
