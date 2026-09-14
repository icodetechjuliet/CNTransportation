<template><q-select
    square
    dense
    outlined
    bg-color="blue-1"
    v-model="user"
    :options="options"
    :label="label"
    use-input
    fill-input
    display-value=""
    input-debounce="0"
    class="truncate-text"
    option-value="id"
    option-label="name"
    @filter="filterFn"
    @input-value="onInputValue"
    hide-dropdown-icon
    @update:model-value="onSelection"
    @focus="isFocused = 'user'"
    :clearable="isFocused === 'user'"
    :rules="isMandatory === 'Y' ? [(val) => !!val || 'Required'] : []"
  >
    <template v-slot:append>
      <q-icon name="search" @mousedown.stop="handleIconClick(name)" />
    </template>
  </q-select><q-dialog v-model="dialogVisible">
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6">
            <q-input
              dense
              filled
              bg-color="blue-1"
              v-model="searchQuery"
              label="Search "
              clearable
              style="padding-bottom: 10px"
            >
              <template v-slot:append>
                <q-icon name="search" @click="filterGridFn(searchQuery)" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6" align="right">
            <q-btn label="Close" color="primary" @click="closeDialog" />
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12">
          <q-table
            square
            card-class="bg-white-1 text-black-3"
            table-class="text-white-8 gridtable"
            table-header-class="bg-blue-white text-black"
            :rows="tableRows"
            :columns="TableColumns"
            row-key="id"
            :visible-columns="visibleTableColumns"
            :pagination="pagination"
            :rows-per-page-options="[10]"
            width="100%"
          >
            <template v-slot:body-cell-action="props">
              <q-td>
                <q-btn
                  icon="check"
                  color="green"
                  dense
                  round
                  size="sm"
                  @click="selectOption(props.row)"
                ></q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog></template>

<script>
import { readonly, ref } from "vue";
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import { Console } from "console";
export default {
  name: "UserComponent",
  props: {
    flag: {
      type: String,
      default: "value",
    },
    isMandatory: {
      type: String,
      default: "N",
    },
    label: {
      type: String,
      default: "value",
    },
  },
  data() {
    return {
      user: "",
      allOptions: [],
      options: [],
      tableRows: [],
      searchQuery: "",
      isFocused: "",
      dialogVisible: false,
      visibleTableColumns: ref(["action", "name"]),
      TableColumns: [
        {
          name: "action",
          label: "Action",
          format: (id, row) => {
            return `<q-btn
            icon="edit"
            color="primary"
            dense
            outline
            size="sm"
            @click="selectOption(props.row)"
          ></q-btn>`;
          },
        },
        {
          name: "id",
          label: "Id",
          field: "id",
          sorted: true,
        },
        {
          name: "name",
          label: "Name",
          field: "name",
          sorted: true,
        },
      ],
    };
  },
  computed: {
    isRequired() {
      return (val) => !!val || "Field is mandatory";
    },
  },
  async mounted() {
    await this.LoadUsers();
  },
  methods: {
    handleIconClick() {
      this.tableRows = this.allOptions;
      this.dialogVisible = true;
    },
    closeDialog() {
      this.searchQuery = "";
      this.dialogVisible = false;
    },
    async LoadUsers() {
      try {
        const { data } = await axios.get(`${CargoNet_API}/IndustryData/Users`, {
          params: {
            Flag: this.flag,
          },
        });
        this.allOptions = data;
        this.options = data;
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    },

    filterFn(val, update) {
      update(() => {
        if (val === "") {
          this.options = this.allOptions.slice(0, 10);
        } else {
          const needle = val.toLowerCase();

          this.options = this.allOptions
            .filter((v) => v.name.toLowerCase().includes(needle))
            .slice(0, 10);
        }
      });
    },
    onInputValue(val) {
      if (val === "") {
        this.user = null;
        this.$emit("Selected-User", this.user);
      }
    },
    onSelection(val) {
      let selectedItem = null;
      if (val) {
        selectedItem = this.allOptions.find((x) => x.id === val.id);
      }

      this.$emit("Selected-User", selectedItem);
    },
    filterGridFn(val) {
      if (val) {
        const needle = val.toLowerCase();
        this.tableRows = this.allOptions.filter((item) =>
          item.name.toLowerCase().includes(needle)
        );
      } else {
        this.tableRows = this.allOptions;
      }
    },
    selectOption(option) {
      this.user = option;
      this.searchQuery = "";
      this.dialogVisible = false;
      this.$emit("Selected-User", this.user);
    },
  },
};
</script>
