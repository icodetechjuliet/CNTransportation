<template>
  <q-input
    square
    dense
    outlined
    bg-color="blue-1"
    :label="label"
    v-model="displayDate"
    mask="##/##/####"
    :error="isFieldMandatory(label, modelValue)"
    :rules="getFieldRules(label)"
    @focus="isFocused = true"
    @blur="onBlur"
    @update:model-value="onManualInput"
    @input="onManualInput"
    :readonly="readonly"
    display-value=""
    @click="openPopup"
  >
    <template v-slot:append>
      <q-btn
        v-if="(modelValue || manualInput) && isFocused"
        flat
        icon="close"
        size="xs"
        class="clear-btn"
        @click="clearDate"
        aria-label="Clear"
        :readonly="readonly"
      />
      <q-icon name="event" round>
        <q-popup-proxy
          ref="popupRef"
          class="w-300"
          color="black"
          cover
          transition-show="scale"
          transition-hide="scale"
          :readonly="readonly"
        >
          <q-date
            v-model="internalISO"
            @update:model-value="onQDateUpdate"
            :default-year-month="defaultYearMonth"
            mask="YYYY-MM-DD"
            :readonly="readonly"
            :options="dateOptionsFn"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { date } from "quasar";
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export default {
  name: "SharedDateInput",
  props: {
    label: { type: String, default: "Select Date" },
    modelValue: { type: String, default: "" }, // stored/emitted as DD/MM/YYYY
    readonly: { type: Boolean, default: false },
    isFieldMandatory: { type: Function, default: () => false },
    getFieldRules: { type: Function, default: () => [] },
    disableFY: { type: String, default: "N" },
    // Backdate control — opt-in, off by default so other DateInput usages are unaffected.
    enforceBackdate: { type: Boolean, default: false },
    backdatePermission: { type: [Boolean, Number, String], default: false },
    // Voucher type id (vtpid) — required by the voucherbackdatevalidation API when enforceBackdate is set.
    voucherTypeId: { type: [String, Number], default: "" },
  },
  emits: ["update:modelValue"],
  data() {
    const today = new Date();
    const isoToday = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    return {
      internalISO: this.parseToISO(this.modelValue),
      isFocused: false,
      manualInput: "",
      CurrentFinancialYear: [],
      hasManualError: false,
    };
  },
  computed: {
    displayDate: {
      get() {
        // If user is typing, show that
        if (this.manualInput) return this.manualInput;

        // Otherwise show formatted ISO date
        this.$emit(
          "update:modelValue",
          this.internalISO ? this.isoToDisplay(this.internalISO) : ""
        );
        return this.internalISO ? this.isoToDisplay(this.internalISO) : "";
      },
      set(val) {
        this.manualInput = val;
      },
    },
    defaultYearMonth() {
      if (this.internalISO) {
        const p = this.internalISO.split("-");
        return `${p[0]}/${p[1]}`;
      }
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      return `${year}/${month}`;
    },
    hasBackdatePermission() {
      return (
        this.backdatePermission === true ||
        this.backdatePermission === 1 ||
        this.backdatePermission === "1"
      );
    },
  },
  watch: {
    // modelValue(newVal) {
    //
    //   if (!newVal) {
    //     this.internalISO = "";
    //     this.manualInput = "";
    //     this.hasManualError = false;
    //     return;
    //   }
    //   newVal = newVal.split("T")[0];
    //   this.internalISO = this.parseToISO(newVal);
    //   this.$emit("update:modelValue", this.parseToISO(newVal));
    // },
    modelValue(newVal) {
      if (!newVal) {
        this.internalISO = "";
        this.manualInput = "";
        this.hasManualError = false;
        return;
      }

      // If already in dd/mm/yyyy format → convert to ISO first
      const isDDMMYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(newVal);
      if (isDDMMYYYY) {
        this.internalISO = this.parseToISO(newVal); // ← FIX: convert instead of direct assign
        return;
      }

      // If ISO format like 2026-03-02T00:00:00
      newVal = newVal.split("T")[0];
      this.internalISO = this.parseToISO(newVal);
      this.$emit("update:modelValue", this.isoToDisplay(this.internalISO));
    },
    async manualInput(val) {
      if (!val || val.length < 10) return;

      const iso = this.parseToISO(val);

      if (!iso) {
        this.clearDate();
        return;
      }

      if (!this.validateDateRange(iso)) return;
      if (!(await this.checkBackdateApproval(iso))) {
        this.clearDate();
        return;
      }

      this.internalISO = iso;
      this.$emit("update:modelValue", this.isoToDisplay(this.internalISO));

      // 🔥 switch display control back to ISO
      this.manualInput = "";
    },
  },
  mounted() {
    if (!this.modelValue) {
      this.$emit("update:modelValue", this.isoToDisplay(this.internalISO));
    }
    this.LoadCurrentFinancialYear();
  },
  methods: {
    validateDateRange(selectedISO) {
      if (this.voucherTypeId === "") return;
      // Fast client-side gate: no backdate permission at all → block immediately, no API call needed.
      if (
        this.enforceBackdate &&
        selectedISO < this.getTodayISO() &&
        !this.hasBackdatePermission
      ) {
        this.$q.notify({
          type: "negative",
          message: "You do not have permission to select a backdated date",
          position: "center",
          timeout: 2000,
        });
        this.clearDate();
        return false;
      }

      // If CurrentFinancialYear not loaded yet, skip validation
      if (
        !this.CurrentFinancialYear ||
        this.CurrentFinancialYear.length === 0
      ) {
        return true;
      }

      if (this.disableFY === "Y") {
        return true;
      }

      const fy = this.CurrentFinancialYear[0]; // Get the current financial year
      const fromDate = this.parseToISO(fy.FromDate);
      const toDate = this.parseToISO(fy.Todate);

      // Check if selected date is before from date
      if (selectedISO < fromDate) {
        this.$q.notify({
          message: "Date should be within this financial year",
          position: "center",
          timeout: 2000,
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        this.clearDate();
        this.hasManualError = true;
        return false;
      }

      // Check if selected date exceeds to date
      if (selectedISO > toDate) {
        this.$q.notify({
          message: "Date should be within this financial year",
          position: "center",
          timeout: 2000,
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        this.clearDate();
        return false;
      }

      return true;
    },

    parseToISO(val) {
      if (!val) return "";
      val = String(val).trim();

      // Already ISO-like (YYYY-MM-DD or YYYY/MM/DD)
      const isoMatch = val.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
      if (isoMatch) {
        const [_, y, m, d] = isoMatch;
        if (this.isValidDate(y, m, d)) {
          return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(
            2,
            "0"
          )}`;
        }
        return "";
      }

      // DMY format (DD/MM/YYYY)
      const dmyMatch = val.match(/^(\d{1,2})[\/](\d{1,2})[\/](\d{4})$/);
      if (dmyMatch) {
        const [_, d, m, y] = dmyMatch;
        if (this.isValidDate(y, m, d)) {
          return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(
            2,
            "0"
          )}`;
        }
      }

      return "";
    },

    isValidDate(y, m, d) {
      y = Number(y);
      m = Number(m);
      d = Number(d);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Helper to show persistent notify and block background
      const showNotify = (message) => {
        // clear manual input immediately when showing the alert
        this.clearDate();
        this.isNotifyActive = true;
        this.$q.notify({
          message,
          position: "center",
          timeout: 2000,
          classes: "negative-alert", // swap per type
          actions: [
            {
              label: "Ok",
              color: "white",
              handler: () => {
                this.isNotifyActive = false; // re-enable background
              },
            },
          ],
        });
      };

      if (!y || !m || !d) {
        showNotify("Invalid Date Format: Date format must be DD/MM/YYYY");
        return false;
      }

      if (m < 1 || m > 12) {
        showNotify("Invalid Date Format: Date format must be DD/MM/YYYY");
        return false;
      }

      const daysInMonth = [
        31,
        this.isLeapYear(y) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];

      const maxDays = daysInMonth[m - 1];
      if (d < 1 || d > maxDays) {
        const monthName = monthNames[m - 1];
        showNotify(`Invalid Date Format: Date format must be DD/MM/YYYY`);
        return false;
      }

      return true;
    },

    // Leap year logic for February
    isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },

    isoToDisplay(iso) {
      if (!iso) return "";
      const parts = iso.split("-");
      if (parts.length !== 3) return iso;
      return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${
        parts[0]
      }`;
    },
    async onQDateUpdate(val) {
      this.$refs.popupRef.hide();
      const iso = this.parseToISO(val);
      if (this.voucherTypeId !== "") {
        if (!this.validateDateRange(iso)) return;
        if (!(await this.checkBackdateApproval(iso))) {
          this.clearDate();
          return;
        }
      }
      this.hasManualError = false;
      this.internalISO = iso;
      this.displayDate = this.isoToDisplay(this.internalISO);
      this.$emit("update:modelValue", this.isoToDisplay(this.internalISO));
    },
    // onManualInput(val) {
    //   const iso = this.parseToISO(val);
    //   if (!iso) {
    //     this.hasManualError = true;
    //     return;
    //   }
    //   if (!this.validateDateRange(iso)) return;
    //   this.hasManualError = false;
    //   this.internalISO = iso;
    //   this.$emit("update:modelValue", iso);
    // },
    async onManualInput(val) {
      // Remove mask placeholders
      const cleaned = (val || "").replace(/_/g, "").replace(/\//g, "").trim();

      // 🔥 If user cleared using keyboard
      if (!cleaned) {
        this.internalISO = "";
        this.manualInput = "";

        // 🔥 Force UI clear
        this.$nextTick(() => {
          this.displayDate = "";
        });

        this.$emit("update:modelValue", "");
        return;
      }

      this.manualInput = val;

      if (val.length < 10) return;

      const iso = this.parseToISO(val);

      if (!iso) {
        this.clearDate();
        return;
      }

      if (this.voucherTypeId === "") return;
      if (!this.validateDateRange(iso)) return;
      if (!(await this.checkBackdateApproval(iso))) {
        this.clearDate();
        return;
      }

      this.internalISO = iso;
      this.$emit("update:modelValue", this.isoToDisplay(this.internalISO));

      this.manualInput = "";
    },
    onBlur() {
      this.isFocused = false;
      // If user leaves invalid date in input, reset it

      if (!this.parseToISO(this.manualInput)) {
        this.displayDate = this.isoToDisplay(this.internalISO);
      }
    },
    clearDate() {
      this.internalISO = "";
      this.manualInput = "";
      this.hasManualError = false;
      this.$emit("update:modelValue", "");
    },
    LoadCurrentFinancialYear() {
      axios
        .get(`${CargoNet_API}/financialyear/currentfinyear`)
        .then((res) => {
          this.CurrentFinancialYear = res.data.map((optionFY) => ({
            FromDate: optionFY.FromDate,
            Todate: optionFY.ToDate,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTodayISO() {
      const today = new Date();
      return `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    },
    // Bound to q-date's :options — with no backdate permission, past days aren't even clickable.
    // With permission, all days are clickable here; the specific date is authoritatively
    // checked against CNAPI (checkBackdateApproval) once the user actually picks/types it.
    dateOptionsFn(dateStr) {
      if (!this.enforceBackdate || this.hasBackdatePermission) return true;
      const iso = dateStr.replace(/\//g, "-");
      return iso >= this.getTodayISO();
    },
    // GET /vouchers/voucherbackdatevalidation/{userid}/{vtpid}/{backdate}
    // Returns the API's { Result, Message } row, or null if the call itself failed.
    async validateVoucherBackdate(userId, vtpid, backdate) {
      try {
        const res = await axios.get(
          `${CargoNet_API}/vouchers/voucherbackdatevalidation/${userId}/${vtpid}/${backdate}`
        );
        return res.data || null;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    // Authoritative server-side check built on validateVoucherBackdate.
    // Result === 1 → allowed to modify; otherwise the returned Message is shown as the issue.
    async checkBackdateApproval(selectedISO) {
      if (this.voucherTypeId === "") return;
      // if (!this.enforceBackdate) return true;
      if (selectedISO >= this.getTodayISO()) return true; // not a backdate — nothing to verify
      // if (!this.hasBackdatePermission) return false; // already blocked/notified by validateDateRange

      const userId = sessionStorage.getItem("APIUserID");
      const result = await this.validateVoucherBackdate(
        userId,
        this.voucherTypeId,
        selectedISO
      );

      if (result && result.IsValid === 1) {
        return true;
      }

      this.$q.notify({
        type: "negative",
        message:
          (result && result.Message) ||
          "Unable to verify backdate permission. Please try again.",
        position: "center",
        timeout: 2500,
      });
      return false;
    },
    openPopup() {
      if (this.readonly) return;
      this.$refs.popupRef.show();
    },
  },
};
</script>
