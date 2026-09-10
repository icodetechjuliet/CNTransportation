// LoadAccountMixin.js
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const LoadTabs = {
  data() {
    return {};
  },
  computed: {
    isFieldMandatory() {
      return (fieldName, fieldValue) => {
        const fieldData = this.Fieldsvisblestatus.find(
          (f) => f.FieldName === fieldName
        );
        return (
          fieldData &&
          fieldData.IsMandatory === "Y" &&
          (fieldValue === null || fieldValue === "")
        );
      };
    },

    GetLabel() {
      return (fieldName) => {
        const fieldData = this.Fieldsvisblestatus.find(
          (f) => f.FieldName === fieldName
        );
        return fieldData && fieldData.AltLabel !== ""
          ? fieldData.AltLabel
          : fieldName;
      };
    },

    // GetLabel() {
    //   return (fieldName) => {
    //     const fieldData = this.Fieldsvisblestatus.find(
    //       (f) => f.FieldName === fieldName
    //     );

    //     const baseLabel =
    //       fieldData && fieldData.AltLabel !== ""
    //         ? fieldData.AltLabel
    //         : fieldName;

    //     const altLabel =
    //       fieldData && fieldData.AltLabel !== "" ? fieldData.AltLabel : null;

    //     // If modifylabel contains this field, add *
    //     const isModified =
    //       this.modifylabel &&
    //       (this.modifylabel.includes(fieldName) ||
    //         (altLabel && this.modifylabel.includes(altLabel)));

    //     if (isModified) {
    //       return baseLabel.endsWith(" *") ? baseLabel : baseLabel + " *";
    //     }

    //     return baseLabel;
    //   };
    // },
    getFieldRules() {
      return (fieldName) => {
        const fieldData = this.Fieldsvisblestatus.find(
          (f) => f.FieldName === fieldName
        );
        return fieldData && fieldData.IsMandatory === "Y"
          ? [(val) => !!val || `${fieldName.toLowerCase()} is required`]
          : [];
      };
    },

    isRequired() {
      return (fieldName) => {
        const fieldData = this.Fieldsvisblestatus.find(
          (f) => f.FieldName === fieldName
        );
        return fieldData && fieldData.IsMandatory === "Y" ? ` *` : "";
      };
    },
  },
  methods: {},
};
