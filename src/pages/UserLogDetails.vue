<template>
  <div v-if="loading" class="loader-container">
    <span class="loader"></span>
    <span class="loader_txt">{{ loadingPercentage }}% </span>
  </div>
  <div v-else>
    <div v-if="Inner_loader">
      <span class="load-container">
        <span class="loader"></span>
        <span class="loader_txt">{{ loadingPercentage }}% </span></span
      >
    </div>
    <q-page padding class="page">
      <!-- content -->
      <div class="folder">
        <q-card class="notab-container-report">
          <div class="row q-px-sm">
            <span class="header_text2"> User Log Details</span>
          </div>
          <div class="q-py-sm q-px-xs">
            <q-separator class="h-seperator"></q-separator>
          </div>
          <div class="q-px-sm q-py-xs">
            <div class="q-gutte-y-md" style="max-width: 100%">
              <div class="col">
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-6 col-sm-6 col-md-2">
                    <q-input
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      v-model="TXTFromDate"
                      label="From Date"
                      mask="date"
                      label-color="blue"
                      :rules="[isRequired]"
                    >
                      <template v-slot:append>
                        <q-icon name="event" round color="black">
                          <q-popup-proxy
                            color="black"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="TXTFromDate"
                              mask="MM/DD/YYYY"
                              color="black"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="black"
                                  flat
                                ></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-6 col-sm-6 col-md-2">
                    <q-input
                      square
                      dense
                      outlined
                      bg-color="blue-1"
                      v-model="TXTToDate"
                      label="To Date"
                      mask="date"
                      label-color="blue"
                      :rules="[isRequired]"
                    >
                      <template v-slot:append>
                        <q-icon name="event" round color="black">
                          <q-popup-proxy
                            color="black"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="TXTToDate" color="black">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="black"
                                  flat
                                ></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-5 col-sm-2 col-md-2">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          dense
                          v-model="Shipment"
                          val="orange"
                          color="orange"
                          intermediate-icon="black"
                        ></q-checkbox>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label> Shipment </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-xs-5 col-sm-2 col-md-2">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          dense
                          v-model="Voucher"
                          val="orange"
                          color="orange"
                          intermediate-icon="black"
                        ></q-checkbox>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label> Voucher </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-5 col-sm-2 col-md-2">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          dense
                          v-model="selectedOperation"
                          :true-value="'I'"
                          :false-value="null"
                          color="orange"
                          intermediate-icon="black"
                        ></q-checkbox>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label> Show Inserted </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-xs-5 col-sm-2 col-md-2">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          dense
                          v-model="selectedOperation"
                          :true-value="'U'"
                          :false-value="null"
                          color="orange"
                          intermediate-icon="black"
                        ></q-checkbox>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label> Show Updated </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-xs-5 col-sm-2 col-md-2">
                    <q-item tag="label" v-ripple>
                      <q-item-section avatar>
                        <q-checkbox
                          dense
                          v-model="selectedOperation"
                          :true-value="'D'"
                          :false-value="null"
                          color="orange"
                          intermediate-icon="black"
                        ></q-checkbox>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label> Show Deleted </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>

                  <div class="col-xs-6 col-sm-6 col-md-4">
                    <q-btn
                      dense
                      color="green-7"
                      label="Search"
                      class="Custom-btn"
                      text-color="white"
                      @click="Search"
                    ></q-btn>
                  </div>
                  <!-- <div class="q-pt-sm">
                <q-table
                  :dense="$q.screen.lt.lg"
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 gridtable"
                  table-header-class="bg-blue-white text-black"
                  :rows="UserLogGrid"
                  :columns="UserLogColumns"
                  row-key="id"
                  :visible-columns="visibleColumns"
                  v-model:pagination="pagination"
                  :rows-per-page-options="[5, 10, 15]"
                  :pagination="true"
                  :rows-per-page="10"
                  :filter="filter"
                  width="100%"
                >
                  <template v-slot:top="props">
                    <q-input
                      borderless
                      dense
                      debounce="300"
                      v-model="filter"
                      class="table-search"
                      placeholder="Search (z)"
                      accesskey="z"
                    >
                      <template v-slot:append>
                        <q-icon name="search"></q-icon>
                      </template>
                    </q-input>

                    <q-space></q-space>
                    <q-select
                      v-model="visibleColumns"
                      multiple
                      borderless
                      dense
                      options-dense
                      :display-value="$q.lang.table.columns"
                      emit-value
                      map-options
                      :options="UserLogColumns"
                      option-value="name"
                    ></q-select>

                    <q-btn
                      flat
                      round
                      dense
                      :icon="
                        props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                      "
                      @click="props.toggleFullscreen"
                      class="q-ml-md"
                    ></q-btn>
                  </template>
                </q-table>
              </div> -->
                  <div class="chart-section">
                    <div class="chart-container">
                      <h2 class="header_text1">Module-wise Logs</h2>
                      <canvas id="userModuleChart"></canvas>
                    </div>
                  </div>

                  <div class="chart-section">
                    <div class="chart-container">
                      <h2 class="header_text1">User-wise Logs</h2>
                      <canvas id="userLogChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-page>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  data() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const formatDate = (date) => {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}/${month}/${day}`;
    };
    return {
      loadingPercentage: 0,
      loading: true,
      Inner_loader: true,
      branchid: null,
      TXTFromDate: formatDate(startOfMonth),
      TXTToDate: formatDate(today),
      // TXTFromDate: "",
      // TXTToDate: "",
      selectedOperation: "I",
      Shipment: ref(true),
      Voucher: ref(false),
      formattedFromDate: "",
      formattedToDate: "",
      visibleColumns: ref([
        "DocNo",
        "DocName",
        "Module",
        "UserName",
        "Operation",
      ]),
      filter: ref(""),
      pagination: {
        sortBy: "id", // the column to sort by initially
        descending: false, // whether to sort in descending order
        page: 1, // the current page number
        rowsPerPage: 10, // the number of rows per page
      },
      UserLogColumns: [
        {
          name: "DocTypeId",
          label: "DocTypeId",
          field: "DocTypeId",
          sorted: true,
        },
        {
          name: "DocNo",
          label: "DocNo",
          field: "DocNo",
        },
        {
          name: "DocName",
          label: "DocName",
          field: "DocName",
        },
        {
          name: "Module",
          label: "Module",
          field: "Module",
        },
        {
          name: "ModuleID",
          label: "ModuleID",
          field: "ModuleID",
        },
        {
          name: "UserID",
          label: "UserID",
          field: "UserID",
        },
        {
          name: "UserName",
          label: "UserName",
          field: "UserName",
        },
        {
          name: "Operation",
          label: "Operation",
          field: "Operation",
        },
      ],

      UserLogGrid: [],
    };
  },
  created() {
    this.userid = sessionStorage.getItem("APIUserID");

    this.branchid = sessionStorage.getItem("BranchID");
    this.GetUserLogDetailsGrid();
  },
  mounted() {
    setTimeout(() => {
      this.loading = false; // Set loading to false after a delay of 2 seconds
      this.Inner_loader = false;
    }, 2500);

    this.startLoading();
  },
  watch: {
    TXTFromDate: {
      immediate: true,
      handler(newValue) {
        this.formatDate("TXTFromDate", "formattedFromDate");
      },
    },
    TXTToDate: {
      immediate: true,
      handler(newValue) {
        this.formatDate("TXTToDate", "formattedToDate");
      },
    },
  },
  methods: {
    startLoading() {
      const interval = setInterval(() => {
        this.loadingPercentage += 5;
        if (this.loadingPercentage >= 100) {
          clearInterval(interval);
        }
      }, 300);
    },
    formatDate(dateField, outputField) {
      const parsedDate = new Date(this[dateField]);
      const day = parsedDate.getDate().toString().padStart(2, "0");
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = parsedDate.getFullYear();
      this[outputField] = `${year}-${month}-${day}`;
    },
    Search() {
      this.GetUserLogDetailsGrid();
      this.updateChart();
    },
    GetUserLogDetailsGrid() {
      if (!this.selectedOperation) {
        // console.log("No operation selected.");
        return;
      }

      axios
        .get(
          `${CargoNet_API}/dashboard/shipment/${this.selectedOperation}/${this.formattedFromDate}/${this.formattedToDate}/${this.branchid}`
        )
        .then((res) => {
          this.UserLogGrid = res.data;
          this.updateChart();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateChart() {
      // Process data to get the counts per module and user
      const moduleCounts = {};
      const userCounts = {};
      this.UserLogGrid.forEach((log) => {
        // Count logs per module
        if (moduleCounts[log.Module]) {
          moduleCounts[log.Module]++;
        } else {
          moduleCounts[log.Module] = 1;
        }

        // Count logs per user
        if (userCounts[log.UserName]) {
          userCounts[log.UserName]++;
        } else {
          userCounts[log.UserName] = 1;
        }
      });

      // Define colors for the chart
      const colors = [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ];
      const borderColors = [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ];

      // Ensure we have enough colors for each module and user
      const numberOfModules = Object.keys(moduleCounts).length;
      const numberOfUsers = Object.keys(userCounts).length;
      while (colors.length < numberOfModules || colors.length < numberOfUsers) {
        colors.push(...colors);
        borderColors.push(...borderColors);
      }

      // Destroy previous chart instance if it exists
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Create the module chart
      const ctxModule = document
        .getElementById("userModuleChart")
        .getContext("2d");
      this.chartInstance = new Chart(ctxModule, {
        type: "bar", // or 'bar', 'line','pie','doughnut' etc.
        data: {
          labels: Object.keys(moduleCounts),
          datasets: [
            {
              label: "Number of Logs per Module",
              data: Object.values(moduleCounts),
              backgroundColor: colors.slice(0, numberOfModules),
              borderColor: borderColors.slice(0, numberOfModules),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
        },
      });

      // Create the user chart
      const ctxUser = document.getElementById("userLogChart").getContext("2d");
      new Chart(ctxUser, {
        type: "pie", // Use 'pie' or 'doughnut' for a user-wise distribution
        data: {
          labels: Object.keys(userCounts),
          datasets: [
            {
              label: "Number of Logs per User",
              data: Object.values(userCounts),
              backgroundColor: colors.slice(0, numberOfUsers),
              borderColor: borderColors.slice(0, numberOfUsers),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style></style>
