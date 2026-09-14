<template><q-input
    square
    dense
    outlined
    bg-color="blue-1"
    :v-model="displayDate"
    :label="label"
    readonly
  >
    <template v-slot:append>
      <q-icon name="event" color="black">
        <q-popup-proxy
          ref="datePopup"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="dateModel"
            color="black"
            @update:model-value="onDateSelected"
          >
            <div class="row justify-end">
              <q-btn v-close-popup label="Close" color="black" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input></template>

<script>
export default {
  name: "DateInput",
  props: {
    modelValue: String,
    label: String,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      internalDate: this.modelValue,
    };
  },
  computed: {
    displayDate() {
      return this.formatDateForDisplay(this.internalDate);
    },
    dateModel: {
      get() {
        return this.internalDate;
      },
      set(newValue) {
        if (newValue) {
          const [year, month, day] = newValue.split("-");
          if (year && month && day) {
            this.internalDate = newValue;
            this.$emit("update:modelValue", newValue);
          }
        } else {
          this.internalDate = null;
          this.$emit("update:modelValue", null);
        }
      },
    },
  },
  methods: {
    formatDateForDisplay(isoDate) {
      if (!isoDate || isoDate === "") return "";
      const parts = isoDate.split("-");
      if (parts.length !== 3) return "";
      const year = parts[0];
      const monthStr = parts[1];
      const dayStr = parts[2];
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);
      if (
        isNaN(month) ||
        isNaN(day) ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        return "";
      }
      const paddedDay = String(day).padStart(2, "0");
      const paddedMonth = String(month).padStart(2, "0");
      const fullYear = year;
      return `${paddedDay}/${paddedMonth}/${fullYear}`;
    },
    onDateSelected(newDate) {
      if (newDate) {
        const parts = newDate.split("/");
        if (parts.length === 3) {
          const year = parts[0];
          const month = parts[1].padStart(2, "0");
          const day = parts[2].padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;
          this.internalDate = formattedDate;
          this.$emit("update:modelValue", formattedDate);
        } else {
          this.internalDate = null;
          this.$emit("update:modelValue", null);
        }
      }
      if (this.$refs.datePopup) {
        this.$nextTick(() => {
          setTimeout(() => {
            if (
              this.$refs.datePopup &&
              typeof this.$refs.datePopup.hide === "function"
            ) {
              this.$refs.datePopup.hide();
            }
          }, 100);
        });
      }
    },
  },
};
</script>
