import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const Loadmenusuffixmixin = {
  data() {
    return {};
  },
  computed: {},
  methods: {
    async Getmenusuffix(type) {
      await axios
        .get(`${CargoNet_API}/industrydata/menusuffix/${this.formid}/${type}`)
        .then((res) => {
          this.suffix = res.data[0]?.Qrystring || "";
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
