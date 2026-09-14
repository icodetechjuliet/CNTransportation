<template><q-page padding class="page">
    <div class="folder">
      <!-- ── DESKTOP Header (original design) ── -->
      <div class="row Dashboard-header" v-if="!$q.screen.lt.sm">
        <div class="col-xs-8 col-sm-8 col-lg-8 col-xl-8">
          <div class="Theme-color tittle-text">User Log Dashboard</div>
          <q-dialog v-model="showMailDialog" persistent>
            <q-card>
              <q-card-section>
                <div v-html="emailTemplate"></div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Close"
                  color="primary"
                  @click="showMailDialog = false"
                ></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-right float-right">
          <div class="db-header-actions">
            <q-btn
              icon="filter_alt"
              color="primary"
              label=""
              round
              dense
              @click="showfilters = true"
            ></q-btn>
            <q-btn color="primary" label="" icon="menu" round dense>
              <q-menu auto-close>
                <q-list style="min-width: 100px">
                  <q-item
                    v-for="(option, index) in menuOptions"
                    :key="index"
                    clickable
                    @click="handleOptionClick(option)"
                  >
                    <q-item-section>{{ option.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn
              round
              dense
              color="primary"
              text-color="white"
              icon="note"
              class="note-btn"
            >
              <!-- q-menu (not q-fab-action) — it has built-in viewport
                   collision detection, so this wide panel repositions
                   itself to stay fully on-screen instead of being centered
                   under a narrow 56px anchor and running off the edge. -->
              <q-menu anchor="bottom right" self="top right" :offset="[0, 8]">
                <div class="key-fab-panel">
                  <div class="key-fab-header">
                    <q-icon name="info" size="18px" />
                    <span>Dashboard Notes</span>
                  </div>
                  <div class="key-fab-body">
                    <div class="key-item">
                      <span class="key-num">1</span>
                      <span class="key-text"
                        >The data displays only the records for inserted
                        Shipments and Vouchers</span
                      >
                    </div>
                    <div class="key-item">
                      <span class="key-num">2</span>
                      <span class="key-text"
                        >The calendar 'Days' option displays data that has
                        passed beyond 24 hours</span
                      >
                    </div>
                    <div class="key-item">
                      <span class="key-num">3</span>
                      <span class="key-text"
                        >To view the dashboard, close other tabs to refresh the
                        data.</span
                      >
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
            <q-btn
              icon="person"
              color="primary"
              :label="this.username"
              class="m-btn-style-md radius-md"
            ></q-btn>
          </div>
        </div>
      </div>

      <!-- ── MOBILE Header (new gradient banner) ── -->
      <div class="db-header-card" v-if="$q.screen.lt.sm">
        <div class="db-header-inner">
          <div class="db-header-title">
            <span>User Log Dashboard</span>
          </div>
          <div class="db-header-actions">
            <q-btn
              flat
              round
              dense
              icon="filter_alt"
              class="bg-dblue-lblue"
              color="white"
              @click="showfilters = true"
            >
              <q-tooltip>Filter</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="menu"
              class="bg-dblue-lblue"
              color="white"
            >
              <q-tooltip>Options</q-tooltip>
              <q-menu auto-close>
                <q-list style="min-width: 120px">
                  <q-item
                    v-for="(option, index) in menuOptions"
                    :key="index"
                    clickable
                    @click="handleOptionClick(option)"
                  >
                    <q-item-section>{{ option.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="sticky_note_2"
              class="bg-dblue-lblue"
              color="white"
            >
              <q-tooltip>Notes</q-tooltip>
              <q-menu>
                <q-list style="width: 280px; max-width: 90vw" class="q-pa-sm">
                  <q-item class="key-item text-center">
                    1. The data displays only the records for inserted Shipments
                    and Vouchers
                  </q-item>
                  <q-item class="key-item text-center">
                    2. The calendar 'Days' option displays data that has passed
                    beyond 24 hours
                  </q-item>
                  <q-item class="key-item text-center">
                    3. To view the dashboard, close other tabs to refresh the
                    data.
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
      <q-dialog v-model="showMailDialog" persistent v-if="$q.screen.lt.sm">
        <q-card>
          <q-card-section><div v-html="emailTemplate"></div></q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Close"
              color="primary"
              @click="showMailDialog = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="row q-py-sm">
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
          <div class="pad-all-10">
            <div class="card peach card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label">Sea Export</span>
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/dash_sea_export.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ SEShipment }} <small>/ {{ SEVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
          <div class="pad-all-10">
            <div class="card Seablue card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label">Air Export</span>
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/dash_air_export.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ AEShipment }} <small>/ {{ AEVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
          <div class="pad-all-10">
            <div class="card Grass1 card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label">Sea Import</span>
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/dash_sea_import.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ SIShipment }} <small>/ {{ SIVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
          <div class="pad-all-10">
            <div class="card PinkRose card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label">Air Import</span>
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/dash_air_import.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ AIShipment }} <small>/ {{ AIVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
          v-show="ICSShipment > 0 || ICSVoucher > 0"
        >
          <div class="pad-all-10">
            <div class="card PinkRose card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label"
                    >Import Clearance – Sea</span
                  >
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/cargo-ship.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ ICSShipment }} <small>/ {{ ICSVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
          v-show="ICAShipment > 0 || ICAVoucher > 0"
        >
          <div class="pad-all-10">
            <div class="card Grass1 card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label"
                    >Import Clearance – Air</span
                  >
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/flight.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ ICAShipment }} <small>/ {{ ICAVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
          v-show="ECSShipment > 0 || ECSVoucher > 0"
        >
          <div class="pad-all-10">
            <div class="card Seablue card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label"
                    >Export Clearance – Sea</span
                  >
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/cargo-ship.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ ECSShipment }} <small>/ {{ ECSVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
          v-show="ECAShipment > 0 || ECAVoucher > 0"
        >
          <div class="pad-all-10">
            <div class="card peach card-shadow ml2-metric-card">
              <div class="card-body">
                <div class="ml2-metric-top">
                  <span class="text-white ml2-metric-label"
                    >Export Clearance – Air</span
                  >
                  <div class="card-inner">
                    <img
                      class="card-img"
                      src="~assets/Shortcode-icon/cargo-ship.png"
                    />
                  </div>
                </div>
                <h3 class="text-white DB-Font">
                  {{ ECAShipment }} <small>/ {{ ECAVoucher }}</small>
                </h3>
                <span class="text-white DB-Inner-Font"
                  >Total Job Count / Invoice Count
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div
          class="col-xs-12 col-sm-6 col-lg-6 col-xl-6"
          v-if="chartOptions && chartSeries && this.showAllLogs"
        >
          <div class="card">
            <apexchart
              ref="apexChart"
              type="area"
              :options="chartOptions"
              :series="chartSeries"
              class="custom-chart chart-title-poppins-medium"
            ></apexchart>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-6 col-lg-6 col-xl-6"
          v-if="chartOptions1 && chartSeries1 && !this.showAllLogs"
        >
          <div class="card">
            <apexchart
              type="area"
              :options="chartOptions1"
              :series="chartSeries1"
              class="custom-chart chart-title-poppins-medium"
            ></apexchart>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-6 col-lg-6 col-xl-6"
          v-if="VchartOptionsAll && VchartSeriesAll && this.showAllLogs"
        >
          <div class="card">
            <apexchart
              ref="apexChartVoucher"
              type="area"
              :options="VchartOptionsAll"
              :series="VchartSeriesAll"
              class="custom-chart chart-title-poppins-medium"
            ></apexchart>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-6 col-lg-6 col-xl-6"
          v-if="VchartOptions && VchartSeries && !this.showAllLogs"
        >
          <div class="card">
            <apexchart
              type="area"
              :options="VchartOptions"
              :series="VchartSeries"
              class="custom-chart chart-title-poppins-medium"
            ></apexchart>
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-lg-6 col-xl-6"
          v-show="showSummary === true"
        >
          <q-card class="DB_tabs">
            <q-tabs
              v-model="selectedTab"
              dense
              class="text-grey custom-tabs"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab
                name="SeaExport"
                label="Sea Export"
                v-show="SEShipmentDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="AirExport"
                label="Air Export"
                v-show="AEShipmentDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="SeaImport"
                label="Sea Import"
                v-show="SIShipmentDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="AirImport"
                label="AirImport"
                v-show="AIShipmentDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="ImportClearanceSea"
                label="ImportClearanceSea"
                v-show="ICSShipmentDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="ImportClearanceAir"
                label="ImportClearanceAir"
                v-show="ICAShipmentDetailsGrid.length > 0"
              ></q-tab>

              <q-tab
                name="ExportClearanceSea"
                label="ExportClearanceSea"
                v-show="ECSShipmentDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="ExportClearanceAir"
                label="ExportClearanceAir"
                v-show="ECAShipmentDetailsGrid.length > 0"
              ></q-tab>
            </q-tabs>

            <q-separator></q-separator>

            <q-tab-panels v-model="selectedTab" animated>
              <q-tab-panel name="SeaExport" class="Tabscontent">
                <q-table
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="Theme-color"
                  :rows="SEShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body-cell-SNo="props">
                    <q-td :props="props">
                      {{ props.pageIndex + 1 }}
                    </q-td>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="AirExport" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="AEShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="SeaImport" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="SIShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="AirImport" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="AIShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="ImportClearanceSea" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ICSShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="ImportClearanceAir" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ICAShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="ExportClearanceSea" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ECSShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table> </q-tab-panel
              ><q-tab-panel name="ExportClearanceAir" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ECAShipmentDetailsGridWithSno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                  row-key="SNO"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-lg-6 col-xl-6" v-show="showSummary">
          <q-card class="DB_tabs">
            <q-tabs
              v-model="selectedVoucherTab"
              dense
              class="text-grey custom-tabs"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab
                name="SeaExport"
                label="Sea Export"
                v-show="SEVoucherDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="AirExport"
                label="Air Export"
                v-show="AEVoucherDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="SeaImport"
                label="Sea Import"
                v-show="SIVoucherDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="AirImport"
                label="Air Import"
                v-show="AIVoucherDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="ImportClearanceSea"
                label="ImportClearanceSea"
                v-show="ICSVoucherDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="ImportClearanceAir"
                label="ImportClearanceAir"
                v-show="ICAVoucherDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="ExportClearanceSea"
                label="ExportClearanceSea"
                v-show="ECSVoucherDetailsGrid.length > 0"
              ></q-tab>
              <q-tab
                name="ExportClearanceAir"
                label="ExportClearanceAir"
                v-show="ECAVoucherDetailsGrid.length > 0"
              ></q-tab>
            </q-tabs>

            <q-separator></q-separator>

            <q-tab-panels v-model="selectedVoucherTab" animated>
              <q-tab-panel name="SeaExport" class="Tabscontent">
                <q-table
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="SEVoucherDetailsGridwithsno"
                  :columns="SummaryVoucherDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="AirExport" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="AEVoucherDetailsGridwithsno"
                  :columns="SummaryVoucherDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>

              <q-tab-panel name="SeaImport" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="SIVoucherDetailsGridwithsno"
                  :columns="SummaryVoucherDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="SeaImport" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="SIVoucherDetailsGridwithsno"
                  :columns="SummaryVoucherDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="AirImport" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="AIVoucherDetailsGridwithsno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="ImportClearanceSea" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ICSVoucherDetailsGridwithsno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="ImportClearanceAir" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ICAVoucherDetailsGridwithsno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="ExportClearanceSea" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ECSVoucherDetailsGridwithsno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table> </q-tab-panel
              ><q-tab-panel name="ExportClearanceAir" class="Tabscontent">
                <q-table
                  square
                  card-class="bg-white-1 text-black-3"
                  table-class="text-white-8 DB-Inner-Font"
                  table-header-class="bg-blue-2 gridtableborder DB-Inner-Font Theme-color"
                  :rows="ECAVoucherDetailsGridwithsno"
                  :columns="SummaryDetailscolumns"
                  :visible-columns="visibleSummaryColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  hide-bottom
                  width="100%"
                  virtual-scroll
                  wrap-cells
                  class="scrollable-table"
                  
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        color="primary"
                        align="justify"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        align="justify"
                      >
                        {{ props.row[col.field] }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
      <q-dialog
        v-model="showfilters"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card-section class="q-pa-none dialog-body">
          <FilterPanel
            :userid="userid"
            :username="username"
            :dateRange="dateRange"
            :branchFields="
              selectedbranch
                ? selectedbranch.split(',').map((id) => parseInt(id))
                : []
            "
            :BranchID="branchid"
            :userFields="
              selecteduser
                ? selecteduser.split(',').map((id) => parseInt(id))
                : []
            "
            @apply="applyFilters"
          />
        </q-card-section>
      </q-dialog>

      <!-- <div class="User-container">
        <div class="Branch-Head">
          Calender
          <button
            :class="[
              {
                hide_button: isCalenderVisible,
                open_button: !isCalenderVisible,
              },
            ]"
            @click="toggleCalenderVisibility"
          ></button>
        </div>
        <div class="Scroll" v-show="isCalenderVisible">
          <div v-for="User in calendarOptions" :key="User.value">
            <input
              type="checkbox"
              :id="User.value"
              :value="User.value"
              v-model="selectedCalendar[User.label]"
              @click="updateCalender(User.value)"
            />
            <label class="chk-box" :for="User.value">{{ User.label }}</label>
          </div>
        </div>

        <div class="Branch-Head">
          User
          <button
            :class="[
              {
                hide_button: isUserVisible,
                open_button: !isUserVisible,
              },
            ]"
            @click="toggleVisibility"
          ></button>
        </div>
        <div class="Scroll" v-show="isUserVisible">
          <div>
            <input
              type="checkbox"
              :id="'select-all'"
              :checked="isAllSelected"
              @click="uncheckall()"
            />
            <label class="chk-box" :for="'select-all'">Select All</label>
          </div>
          <div v-for="User in Users" :key="User.value">
            <input
              type="checkbox"
              :id="User.value"
              :value="User.value"
              v-model="userFields[User.label]"
              @click="updateUser(User.value)"
              :class="{ 'readonly-wrapper': Userreadonly }"
              :disabled="isUserDisabled(User.value)"
            />
            <label
              class="chk-box"
              :for="User.value"
              :class="{ 'readonly-wrapper': Userreadonly }"
              >{{ User.label }}</label
            >
          </div>
        </div>

        <div class="Branch-Head">
          Branch
          <button
            :class="[
              {
                hide_button: isBranchVisible,
                open_button: !isBranchVisible,
              },
            ]"
            @click="toggleBranchVisibility"
          ></button>
        </div>
        <div class="Scroll" v-show="isBranchVisible">
          <div v-for="field in branch" :key="field.value">
            <input
              type="checkbox"
              :id="field.value"
              :value="field.value"
              v-model="selectedFields[field.label]"
              @click="updateBranch(field.value)"
              :disabled="isBranchDisabled(field.value)"
            />
            <label class="chk-box" :for="field.value">{{ field.label }}</label>
          </div>
        </div>
      </div> -->
    </div>
  </q-page></template>

<script>
import { ref } from "vue";
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
import { Chart, registerables } from "chart.js";
import UserLogDetails from "./UserLogDetails.vue";
import { LoaderMixin } from "src/mixins/Loadermixin.js";
import VueApexCharts from "vue3-apexcharts";
import FilterPanel from "src/components/ApplyFiltersComponent.vue";
import {
  MOCK_LOGIN_MODE,
  buildMockBranchFields,
} from "src/IPConfig/mockData.js";

Chart.register(...registerables);

export default {
  components: {
    apexchart: VueApexCharts,
    FilterPanel,
  },

  inject: {
    openTab: { default: null },
  },

  name: "DashboardChart",

  mixins: [LoaderMixin],
  created() {
    this.userid = sessionStorage.getItem("APIUserID");

    this.branchid = sessionStorage.getItem("BranchID");
    this.selectedbranch = sessionStorage.getItem("BranchID");
    this.selecteduser = sessionStorage.getItem("APIUserID");
    this.username = sessionStorage.getItem("APIEmail");
    this.AutoWtsAppMsgsts = sessionStorage.getItem("AutoWtsAppMsg");
    // this.updateChart();
  },
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
      showfilters: false,
      fab: false,
      AutoWtsAppMsgsts: "N",
      chartOptions: {
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "11px",
            fontWeight: 700,
          },
          dropShadow: {
            enabled: false,
          },
        },
        chart: {
          toolbar: { show: true },
          zoom: { enabled: true, type: "x", autoScaleYaxis: true },
          height: 450,
          width: "100%",
          events: {
            legendClick: (chartContext, seriesIndex, config) => {
              const clickedSeriesName = config.globals.seriesNames[seriesIndex];

              // Use this method correctly
              chartContext.toggleSeries("shipment", clickedSeriesName);

              return false; // prevent default toggle
            },
          },
        },
        stroke: {
          width: 1.5,
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.65,
            inverseColors: false,
            opacityFrom: 0.65,
            opacityTo: 0.08,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: ["Jan"], // Will be populated later
        },
        title: {
          text: "No Of Shipments Posted",
          align: "left",
          offsetY: 2,
        },
        responsive: [
          {
            breakpoint: 1440,
            options: {
              chart: { height: 310 },
            },
          },
          {
            breakpoint: 1200,
            options: {
              chart: { height: 290 },
            },
          },
          {
            breakpoint: 992,
            options: {
              chart: { height: 280 },
            },
          },
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 290,
                toolbar: {
                  offsetY: 26,
                },
              },
              title: { style: { fontSize: "13px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 600,
            options: {
              chart: { height: 300 },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 270,
                toolbar: {
                  tools: { zoom: false, pan: false },
                },
              },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
        ],
      },
      chartSeries: [
        {
          name: "",
          data: [0],
        },
      ],
      chartOptions1: {
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "11px",
            fontWeight: 700,
          },
          dropShadow: {
            enabled: false,
          },
        },
        chart: {
          toolbar: {
            show: true,
          },
          zoom: { enabled: true, type: "x", autoScaleYaxis: true },
          height: 450,
          width: "100%",
        },

        stroke: {
          width: 1.5,
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.65,
            inverseColors: false,
            opacityFrom: 0.65,
            opacityTo: 0.08,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: ["Jan"], // Will be populated later
        },
        title: {
          text: "No Of Shipments Posted",
          align: "left",
          offsetY: 2,
        },
        responsive: [
          {
            breakpoint: 1440,
            options: {
              chart: { height: 310 },
            },
          },
          {
            breakpoint: 1200,
            options: {
              chart: { height: 290 },
            },
          },
          {
            breakpoint: 992,
            options: {
              chart: { height: 280 },
            },
          },
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 290,
                toolbar: {
                  offsetY: 26,
                },
              },
              title: { style: { fontSize: "13px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 600,
            options: {
              chart: { height: 300 },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 270,
                toolbar: {
                  tools: { zoom: false, pan: false },
                },
              },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
        ],
      },
      chartSeries1: [
        {
          name: "",
          data: [0],
        },
      ],
      VchartOptionsAll: {
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "11px",
            fontWeight: 700,
          },
          dropShadow: {
            enabled: false,
          },
        },
        chart: {
          toolbar: {
            show: true,
          },
          zoom: { enabled: true, type: "x", autoScaleYaxis: true },
          height: 450,
          width: "100%",
          events: {
            legendClick: (chartContext, seriesIndex, config) => {
              const clickedSeriesName = config.globals.seriesNames[seriesIndex];

              // Use this method correctly
              chartContext.toggleSeries("voucher", clickedSeriesName);

              return false; // prevent default toggle
            },
          },
        },
        stroke: {
          width: 1.5,
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.65,
            inverseColors: false,
            opacityFrom: 0.65,
            opacityTo: 0.08,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: ["Jan"], // Will be populated later
        },
        title: {
          text: "No Of Vouchers Posted",
          align: "left",
          offsetY: 2,
        },
        responsive: [
          {
            breakpoint: 1440,
            options: {
              chart: { height: 310 },
            },
          },
          {
            breakpoint: 1200,
            options: {
              chart: { height: 290 },
            },
          },
          {
            breakpoint: 992,
            options: {
              chart: { height: 280 },
            },
          },
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 290,
                toolbar: {
                  offsetY: 26,
                },
              },
              title: { style: { fontSize: "13px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 600,
            options: {
              chart: { height: 300 },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 270,
                toolbar: {
                  tools: { zoom: false, pan: false },
                },
              },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
        ],
      },
      VchartSeriesAll: [
        {
          name: "",
          data: [0],
        },
      ],
      VchartOptions: {
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "11px",
            fontWeight: 700,
          },
          dropShadow: {
            enabled: false,
          },
        },
        chart: {
          toolbar: {
            show: true,
          },
          zoom: { enabled: true, type: "x", autoScaleYaxis: true },
          height: 450,
          width: "100%",
        },
        stroke: {
          width: 1.5,
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.65,
            inverseColors: false,
            opacityFrom: 0.65,
            opacityTo: 0.08,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: ["Jan"],
        },
        title: {
          text: "No Of Vouchers Posted",
          align: "left",
          offsetY: 2,
        },
        responsive: [
          {
            breakpoint: 1440,
            options: {
              chart: { height: 310 },
            },
          },
          {
            breakpoint: 1200,
            options: {
              chart: { height: 290 },
            },
          },
          {
            breakpoint: 992,
            options: {
              chart: { height: 280 },
            },
          },
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 290,
                toolbar: {
                  offsetY: 26,
                },
              },
              title: { style: { fontSize: "13px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 600,
            options: {
              chart: { height: 300 },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 270,
                toolbar: {
                  tools: { zoom: false, pan: false },
                },
              },
              title: { style: { fontSize: "12px" }, offsetY: -4 },
            },
          },
        ],
      },
      VchartSeries: [
        {
          name: "",
          data: [0],
        },
      ],
      loadingPercentage: 0,
      loading: true,
      Inner_loader: true,
      branchid: null,
      userid: 0,
      TXTFromDate: formatDate(startOfMonth),
      TXTToDate: formatDate(today),
      // TXTFromDate: "",
      // TXTToDate: "",
      selectedOperation: "I",
      dateRange: { from: null, to: null },
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
      SEShipment: 0,
      SEVoucher: 0,
      AEShipment: 0,
      AEVoucher: 0,
      SIShipment: 0,
      SIVoucher: 0,
      AIShipment: 0,
      AIVoucher: 0,
      ICSShipment: 0,
      ICSVoucher: 0,
      ICAShipment: 0,
      ICAVoucher: 0,
      ECSShipment: 0,
      ECSVoucher: 0,
      ECAShipment: 0,
      ECAVoucher: 0,
      UserLogVoucherGrid: [],
      branch: [],
      selectedFields: {},
      userFields: {},
      isAllSelected: false,
      updatedFields: [],
      updateduserFields: [],
      selectedbranch: "",
      Users: [],
      selecteduser: "",
      username: "",
      pendingSavedFilters: null,
      isUserVisible: true,
      isBranchVisible: true,
      isCalenderVisible: true,
      calendarOptions: [
        { label: "All", value: "All" },
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
      ],
      selectedCalendar: { All: true, day: false, week: false, month: false },
      selectedCalendarlable: "All",
      showAllLogs: true,
      showMonthLogs: true,
      showWeekLogs: true,
      showDayLogs: true,
      Userreadonly: false,
      selectedTab: "SeaExport",
      selectedVoucherTab: "SeaExport",
      moduleFields: {},
      modules: [],
      visibleSummaryColumns: ref([
        "SNo",
        "Modules",
        "DocumentName",
        "NumberofShipment",
        "Date",
      ]),
      SummaryDetailscolumns: [
        {
          name: "SNo",
          label: "SNo",
          field: "SNo",
        },
        {
          name: "DocumentName",
          label: "Document Type",
          field: "DocName",
        },
        {
          name: "NumberofShipment",
          label: "Shipment No",
          field: "DocNo",
        },
        {
          name: "Date",
          label: "Shipment Date",
          field: "Date",
        },
      ],
      SummaryVoucherDetailscolumns: [
        {
          name: "SNo",
          label: "SNo",
          field: "SNo",
        },
        {
          name: "DocumentName",
          label: "Voucher Type",
          field: "DocName",
        },
        {
          name: "NumberofShipment",
          label: "Voucher No",
          field: "DocNo",
        },
        {
          name: "Date",
          label: "Voucher Date",
          field: "Date",
        },
      ],
      ShipmentDetailsGrid: [],
      VoucherDetailsGrid: [],
      SEShipmentDetailsGrid: [],
      AEShipmentDetailsGrid: [],
      SIShipmentDetailsGrid: [],
      AIShipmentDetailsGrid: [],
      ICSShipmentDetailsGrid: [],
      ICAShipmentDetailsGrid: [],
      ECSShipmentDetailsGrid: [],
      ECAShipmentDetailsGrid: [],
      SEVoucherDetailsGrid: [],
      AEVoucherDetailsGrid: [],
      SIVoucherDetailsGrid: [],
      AIVoucherDetailsGrid: [],
      ICSVoucherDetailsGrid: [],
      ICAVoucherDetailsGrid: [],
      ECSVoucherDetailsGrid: [],
      ECAVoucherDetailsGrid: [],
      UserLogMonthWiseGrid: [],
      UserLogVoucherMWGrid: [],
      chartid: parseInt(sessionStorage.getItem("chartid")) || 0,
      chartname: "",
      emailTemplate: "",
      showMailDialog: false,
      imgURI: "",
      imgURIVoucher: "",
      Chartgenerated: false,
      isadmin: "",
      WhatsappPostURL: "",
      Submissionresponse: "",
      menuOptions: [
        { label: "User Log Dashboard", value: "UserLogDetails" },
        { label: "Job Profitability", value: "JobProfitability" },
      ],
      Masterflag: [],
      IsSummaryVisible: "",
      showSummary: "",
      selectedmodules: "",
    };
  },
  // beforeRouteEnter() {
  //   if (this.chartInstance) {
  //     this.chartInstance = null;
  //   }
  //   if (this.VouchartInstance) {
  //     this.VouchartInstance = null;
  //   }
  // },

  mounted() {
    // this.renderChart();
    // this.showLoading();
    try {
      // Initialize dateRange from TXTFromDate and TXTToDate
      this.dateRange = {
        from: new Date(this.TXTFromDate),
        to: new Date(this.TXTToDate),
      };
      Promise.all([
        // this.checkSession(),
        // this.$forceUpdate(),
        this.Checkadminusers(),
        this.LoadUsers(),
        this.LoadBranchFields(),
        this.LoadModules(),
        this.GetDynamicConfig(),
        // this.GetUserLogDetailsGrid(),
        // this.GetVoucherDetailsGrid(),
        // this.GetShipmentSummaryGrid(),
        // this.GetVoucherSummaryGrid(),
      ]).then(() => {
        // this.GetUserLogmonthwiseDetailsGrid();
        // this.GetVoucherMWDetailsGrid();
        this.loadUserFromSession();
        this.loadSavedFilters();
        this.applyPendingSavedFilters();
        // Load data with saved filters
        this.GetUserLogDetailsGrid(this.selectedbranch, this.selecteduser);
        this.GetUserLogmonthwiseDetailsGrid(
          this.selectedbranch,
          this.selecteduser
        );
        this.GetVoucherDetailsGrid(this.selectedbranch, this.selecteduser);
        this.GetVoucherMWDetailsGrid(this.selectedbranch, this.selecteduser);
        // this.loadCalenderFromSession();
        // this.updateCalender("All");
        this.$q.loading.hide();
      });
    } catch (error) {
      console.log(error);
    }
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
    // Chartgenerated() {
    //   if (this.Chartgenerated === true) {
    //     setTimeout(async () => {
    //       await this.updateMonthChart(); // Wait for the chart to update
    //       await this.updateVoucherChart(); // Wait for the chart to update
    //       if (this.AutoWtsAppMsgsts === "Y") {
    //         this.generateEmailTemplate(); // Generate the email template
    //         this.GetEIPostURL();
    //       }
    //     }, 3000);
    //   }
    // },
    WhatsappPostURL() {
      this.sendwhatsappmsg();
    },
    AutoWtsAppMsgsts() {
      if (this.AutoWtsAppMsgsts === "Y") {
        const option = {
          label: "Job Profitability",
          value: "JobProfitability",
        };
        this.handleOptionClick(option);
      }
    },
    Masterflag() {
      const SummaryVisible = this.Masterflag.filter(
        (row) => row.name === "ShowDashboardSummary"
      );
      if (this.IsSummaryVisible.length > 0) {
        this.IsSummaryVisible = SummaryVisible[0].flag;
      }
    },
    UserLogMonthWiseGrid(val) {
      if (val.length > 0) {
        this.updateMonthChart();
        this.updateMonthChart1();
        this.updateCounter(this.UserLogMonthWiseGrid);
      }
    },
    UserLogVoucherGrid(val) {
      if (val.length > 0) {
        this.updateVoucherChart();
      }
    },
    // updatedFields(val) {
    //
    //   if (val <= 2) {
    //     this.updateBranch();
    //   }
    // },
  },
  computed: {
    SEShipmentDetailsGridWithSno() {
      return this.SEShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    AEShipmentDetailsGridWithSno() {
      return this.AEShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    AIShipmentDetailsGridWithSno() {
      return this.AIShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    ICSShipmentDetailsGridWithSno() {
      return this.ICSShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    ICAShipmentDetailsGridWithSno() {
      return this.ICAShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    ECSShipmentDetailsGridWithSno() {
      return this.ECSShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    ECAShipmentDetailsGridWithSno() {
      return this.ECAShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    SIShipmentDetailsGridWithSno() {
      return this.SIShipmentDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },

    SEVoucherDetailsGridwithsno() {
      return this.SEVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    AEVoucherDetailsGridwithsno() {
      return this.AEVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    SIVoucherDetailsGridwithsno() {
      return this.SIVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    AIVoucherDetailsGridwithsno() {
      return this.AIVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },

    ICSVoucherDetailsGridwithsno() {
      return this.ICSVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    ICAVoucherDetailsGridwithsno() {
      return this.ICAVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    ECSVoucherDetailsGridwithsno() {
      return this.ECSVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
    ECAVoucherDetailsGridwithsno() {
      return this.ECAVoucherDetailsGrid.map((row, index) => ({
        ...row,
        SNo: index + 1,
      }));
    },
  },
  methods: {
    // checkSession() {
    //   const session = sessionStorage.getItem("APIUserID");
    //   if (!session) {
    //     this.$router.push("/");
    //   }
    // },
    async generateEmailTemplate() {
      const SECount = this.SEShipment;
      const AECount = this.AEShipment;
      const SICount = this.SIShipment;
      const AICount = this.AIShipment;

      const SEVCount = this.SEVoucher;
      const AEVCount = this.AEVoucher;
      const SIVCount = this.SIVoucher;
      const AIVCount = this.AIVoucher;

      this.emailTemplate = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h4>Shipment Log Summary</h4>
      <p>Hello,</p>
      <p>Please find the latest shipment log summary below:</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd;">Module</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Shipment Count</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Voucher Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">SE Logs</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${SECount}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${SEVCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">AE Logs</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${AECount}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${AEVCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">SI Logs</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${SICount}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${SIVCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">AI Logs</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${AICount}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${AIVCount}</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Chart Overview:</strong></p>
      <img src="${this.imgURI}" alt="Shipment Log Chart" style="width: 100%; max-width: 600px; border: 1px solid #ddd; padding: 8px;">
      <img src="${this.imgURIVoucher}" alt="Shipment Log Chart" style="width: 100%; max-width: 600px; border: 1px solid #ddd; padding: 8px;">
      <p>Best regards,<br>Your Team</p>
    </div>
  `;
      this.showMailDialog = true;
      const today = new Date();
      const formattedDateTime = `${String(today.getDate()).padStart(
        2,
        "0"
      )}/${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${today.getFullYear()} ${String(today.getHours()).padStart(
        2,
        "0"
      )}:${String(today.getMinutes()).padStart(2, "0")}:${String(
        today.getSeconds()
      ).padStart(2, "0")}`;

      if (!MOCK_LOGIN_MODE) {
        await axios.post(`${CargoNet_API}/dashboard/insertmail`, {
          template: this.emailTemplate,
          date: formattedDateTime,
        });
      }

      return this.emailTemplate;
    },
    // async updateCounter(newValue) {
    //   const SELogs = newValue.filter((row) => row.ModuleID === 1);
    //   const AELogs = newValue.filter((row) => row.ModuleID === 2);
    //   const SILogs = newValue.filter((row) => row.ModuleID === 3);
    //   const AILogs = newValue.filter((row) => row.ModuleID === 4);
    //   const ICSLogs = newValue.filter((row) => row.ModuleID === 5);
    //   const ICALogs = newValue.filter((row) => row.ModuleID === 6);
    //   const ECSLogs = newValue.filter((row) => row.ModuleID === 7);
    //   const ECALogs = newValue.filter((row) => row.ModuleID === 8);
    //   newValue = SELogs.length;
    //   this.isAnimating = true;
    //   const startValue = this.SEShipment;
    //   const duration = 1000;
    //   const stepTime = 100;
    //   const totalSteps = duration / stepTime;
    //   const increment = (newValue - startValue) / totalSteps;
    //   let currentStep = 0;

    //   const interval = setInterval(() => {
    //     this.SEShipment = Math.round(startValue + increment * currentStep);
    //     currentStep++;

    //     if (currentStep > totalSteps) {
    //       clearInterval(interval);
    //       this.isAnimating = false;
    //       this.SEShipment = newValue;
    //     }
    //   }, stepTime);

    //   const newValueAE = AELogs.length;
    //   const startValueAE = this.AEShipment;
    //   const durationAE = 1000;
    //   const stepTimeAE = 100;
    //   const totalStepsAE = durationAE / stepTimeAE;
    //   const incrementAE = (newValueAE - stepTimeAE) / totalStepsAE;
    //   let currentStepAE = 0;

    //   const intervalAE = setInterval(() => {
    //     this.AEShipment = Math.round(
    //       startValueAE + incrementAE * currentStepAE
    //     );
    //     currentStepAE++;

    //     if (currentStepAE > totalStepsAE) {
    //       clearInterval(intervalAE);
    //       this.isAnimating = false;
    //       this.AEShipment = newValueAE;
    //     }
    //   }, stepTime);

    //   const newValueAI = AILogs.length;
    //   const startValueAI = this.AIShipment;
    //   const durationAI = 1000;
    //   const stepTimeAI = 100;
    //   const totalStepsAI = durationAI / stepTimeAI;
    //   const incrementAI = (newValueAI - stepTimeAI) / totalStepsAI;
    //   let currentStepAI = 0;

    //   const intervalAI = setInterval(() => {
    //     this.AIShipment = Math.round(
    //       startValueAI + incrementAI * currentStepAI
    //     );
    //     currentStepAI++;

    //     if (currentStepAI > totalStepsAI) {
    //       clearInterval(intervalAI);
    //       this.isAnimating = false;
    //       this.AIShipment = newValueAI;
    //     }
    //   }, stepTime);
    //   const newValueSI = SILogs.length;
    //   const startValueSI = this.AIShipment;
    //   const durationSI = 1000;
    //   const stepTimeSI = 100;
    //   const totalStepsSI = durationSI / stepTimeSI;
    //   const incrementSI = (newValueSI - stepTimeSI) / totalStepsSI;
    //   let currentStepSI = 0;

    //   const intervalSI = setInterval(() => {
    //     this.SIShipment = Math.round(
    //       startValueSI + incrementSI * currentStepSI
    //     );
    //     currentStepSI++;

    //     if (currentStepSI > totalStepsSI) {
    //       clearInterval(intervalSI);
    //       this.isAnimating = false;
    //       this.SIShipment = newValueSI;
    //     }
    //   }, stepTime);

    //   const newValueICS = ICSLogs.length;
    //   const startValueICS = this.ICSShipment;
    //   const durationICS = 1000;
    //   const stepTimeICS = 100;
    //   const totalStepsICS = durationICS / stepTimeICS;
    //   const incrementICS = (newValueICS - stepTimeICS) / totalStepsICS;
    //   let currentStepICS = 0;

    //   const intervalICS = setInterval(() => {
    //     this.ICSShipment = Math.round(
    //       startValueICS + incrementICS * currentStepICS
    //     );
    //     currentStepICS++;

    //     if (currentStepICS > totalStepsICS) {
    //       clearInterval(intervalICS);
    //       this.isAnimating = false;
    //       this.ICSShipment = newValueICS;
    //     }
    //   }, stepTime);
    //   const newValueICA = ICALogs.length;
    //   const startValueICA = this.ICAShipment;
    //   const durationICA = 1000;
    //   const stepTimeICA = 100;
    //   const totalStepsICA = durationICA / stepTimeICA;
    //   const incrementICA = (newValueICA - stepTimeICA) / totalStepsICA;
    //   let currentStepICA = 0;

    //   const intervalICA = setInterval(() => {
    //     this.ICAShipment = Math.round(
    //       startValueICA + incrementICA * currentStepICA
    //     );
    //     currentStepICA++;

    //     if (currentStepICA > totalStepsICA) {
    //       clearInterval(intervalICA);
    //       this.isAnimating = false;
    //       this.ICAShipment = newValueICA;
    //     }
    //   }, stepTime);

    //   const newValueECS = ECSLogs.length;
    //   const startValueECS = this.ECSShipment;
    //   const durationECS = 1000;
    //   const stepTimeECS = 100;
    //   const totalStepsECS = durationECS / stepTimeECS;
    //   const incrementECS = (newValueECS - stepTimeECS) / totalStepsECS;
    //   let currentStepECS = 0;

    //   const intervalECS = setInterval(() => {
    //     this.ECSShipment = Math.round(
    //       startValueECS + incrementECS * currentStepECS
    //     );
    //     currentStepECS++;

    //     if (currentStepECS > totalStepsECS) {
    //       clearInterval(intervalECS);
    //       this.isAnimating = false;
    //       this.ECSShipment = newValueECS;
    //     }
    //   }, stepTime);
    //   const newValueECA = ECALogs.length;
    //   const startValueECA = this.ECAShipment;
    //   const durationECA = 1000;
    //   const stepTimeECA = 100;
    //   const totalStepsECA = durationECA / stepTimeECA;
    //   const incrementECA = (newValueECA - stepTimeECA) / totalStepsECA;
    //   let currentStepECA = 0;

    //   const intervalECA = setInterval(() => {
    //     this.ECSShipment = Math.round(
    //       startValueECA + incrementECA * currentStepECA
    //     );
    //     currentStepECA++;

    //     if (currentStepECA > totalStepsECA) {
    //       clearInterval(intervalECA);
    //       this.isAnimating = false;
    //       this.ECAShipment = newValueECA;
    //     }
    //   }, stepTime);
    // },
    async updateCounter(newValue) {
      const modules = [
        { id: 1, key: "SEShipment" },
        { id: 2, key: "AEShipment" },
        { id: 3, key: "AIShipment" },
        { id: 4, key: "SIShipment" },
        { id: 5, key: "ICSShipment" },
        { id: 6, key: "ICAShipment" },
        { id: 7, key: "ECSShipment" },
        { id: 8, key: "ECAShipment" },
      ];
      this.isAnimating = true;
      const duration = 1000;
      const stepTime = 100;
      const totalSteps = duration / stepTime;

      modules.forEach(({ id, key }) => {
        const logs = newValue.filter((row) => row.ModuleID === id);
        const newVal = logs.length;
        const startVal = this[key] || 0; // Fallback to 0 if undefined
        const increment = (newVal - startVal) / totalSteps;
        let currentStep = 0;

        const interval = setInterval(() => {
          this[key] = Math.round(startVal + increment * currentStep);
          currentStep++;

          if (currentStep > totalSteps) {
            clearInterval(interval);
            this[key] = newVal;
          }
        }, stepTime);
      });

      setTimeout(() => {
        this.isAnimating = false;
      }, duration + 100);
    },
    // async updateVouCounter(newValue) {
    //   const SELogs = newValue.filter((row) => row.ModuleID === 1);
    //   const AELogs = newValue.filter((row) => row.ModuleID === 2);
    //   const SILogs = newValue.filter((row) => row.ModuleID === 3);
    //   const AILogs = newValue.filter((row) => row.ModuleID === 4);
    //   const ICSLogs = newValue.filter((row) => row.ModuleID === 5);
    //   const ICALogs = newValue.filter((row) => row.ModuleID === 6);
    //   const ECSLogs = newValue.filter((row) => row.ModuleID === 7);
    //   const ECALogs = newValue.filter((row) => row.ModuleID === 8);
    //   newValue = SELogs.length;
    //   this.isAnimating = true;
    //   const startValue = this.SEVoucher;
    //   const duration = 1000;
    //   const stepTime = 100;
    //   const totalSteps = duration / stepTime;
    //   const increment = (newValue - startValue) / totalSteps;
    //   let currentStep = 0;

    //   const interval = setInterval(() => {
    //     this.SEVoucher = Math.round(startValue + increment * currentStep);
    //     currentStep++;

    //     if (currentStep > totalSteps) {
    //       clearInterval(interval);
    //       this.isAnimating = false;
    //       this.SEVoucher = newValue;
    //     }
    //   }, stepTime);

    //   const newValueAE = AELogs.length;
    //   const startValueAE = this.AEVoucher;
    //   const durationAE = 1000;
    //   const stepTimeAE = 100;
    //   const totalStepsAE = durationAE / stepTimeAE;
    //   const incrementAE = (newValueAE - stepTimeAE) / totalStepsAE;
    //   let currentStepAE = 0;

    //   const intervalAE = setInterval(() => {
    //     this.AEVoucher = Math.round(startValueAE + incrementAE * currentStepAE);
    //     currentStepAE++;

    //     if (currentStepAE > totalStepsAE) {
    //       clearInterval(intervalAE);
    //       this.isAnimating = false;
    //       this.AEVoucher = newValueAE;
    //     }
    //   }, stepTime);

    //   const newValueAI = AILogs.length;
    //   const startValueAI = this.AIVoucher;
    //   const durationAI = 1000;
    //   const stepTimeAI = 100;
    //   const totalStepsAI = durationAI / stepTimeAI;
    //   const incrementAI = (newValueAI - stepTimeAI) / totalStepsAI;
    //   let currentStepAI = 0;

    //   const intervalAI = setInterval(() => {
    //     this.AIVoucher = Math.round(startValueAI + incrementAI * currentStepAI);
    //     currentStepAI++;

    //     if (currentStepAI > totalStepsAI) {
    //       clearInterval(intervalAI);
    //       this.isAnimating = false;
    //       this.AIVoucher = newValueAI;
    //     }
    //   }, stepTime);
    //   const newValueICS = ICSLogs.length;
    //   const startValueICS = this.ICSVoucher;
    //   const durationICS = 1000;
    //   const stepTimeICS = 100;
    //   const totalStepsICS = durationICS / stepTimeICS;
    //   const incrementICS = (newValueICS - stepTimeICS) / totalStepsICS;
    //   let currentStepICS = 0;

    //   const intervalICS = setInterval(() => {
    //     this.ICSVoucher = Math.round(
    //       startValueICS + incrementICS * currentStepICS
    //     );
    //     currentStepICS++;

    //     if (currentStepICS > totalStepsICS) {
    //       clearInterval(intervalICS);
    //       this.isAnimating = false;
    //       this.ICSVoucher = newValueICS;
    //     }
    //   }, stepTime);

    //   const newValueSI = SILogs.length;
    //   const startValueSI = this.SIVoucher;
    //   const durationSI = 1000;
    //   const stepTimeSI = 100;
    //   const totalStepsSI = durationSI / stepTimeSI;
    //   const incrementSI = (newValueSI - stepTimeSI) / totalStepsSI;
    //   let currentStepSI = 0;

    //   const intervalSI = setInterval(() => {
    //     this.SIVoucher = Math.round(startValueSI + incrementSI * currentStepSI);
    //     currentStepSI++;

    //     if (currentStepSI > totalStepsSI) {
    //       clearInterval(intervalSI);
    //       this.isAnimating = false;
    //       this.SIVoucher = newValueSI;
    //     }
    //   }, stepTime);

    //   const newValueICA = ICALogs.length;
    //   const startValueICA = this.ICAVoucher;
    //   const durationICA = 1000;
    //   const stepTimeICA = 100;
    //   const totalStepsICA = durationICA / stepTimeICA;
    //   const incrementICA = (newValueICA - stepTimeICA) / totalStepsICA;
    //   let currentStepICA = 0;

    //   const intervalICA = setInterval(() => {
    //     this.ICAVoucher = Math.round(
    //       startValueICA + incrementICA * currentStepICA
    //     );
    //     currentStepICA++;

    //     if (currentStepICA > totalStepsICA) {
    //       clearInterval(intervalICA);
    //       this.isAnimating = false;
    //       this.ICAVoucher = newValueICA;
    //     }
    //   }, stepTime);

    //   const newValueECS = ECSLogs.length;
    //   const startValueECS = this.ECSVoucher;
    //   const durationECS = 1000;
    //   const stepTimeECS = 100;
    //   const totalStepsECS = durationECS / stepTimeECS;
    //   const incrementECS = (newValueECS - stepTimeECS) / totalStepsECS;
    //   let currentStepECS = 0;

    //   const intervalECS = setInterval(() => {
    //     this.ECSVoucher = Math.round(
    //       startValueECS + incrementECS * currentStepECS
    //     );
    //     currentStepECS++;

    //     if (currentStepECS > totalStepsECS) {
    //       clearInterval(intervalECS);
    //       this.isAnimating = false;
    //       this.ECSVoucher = newValueECS;
    //     }
    //   }, stepTime);
    //   const newValueECA = ECALogs.length;
    //   const startValueECA = this.ECAVoucher;
    //   const durationECA = 1000;
    //   const stepTimeECA = 100;
    //   const totalStepsECA = durationECA / stepTimeECA;
    //   const incrementECA = (newValueECA - stepTimeECA) / totalStepsECA;
    //   let currentStepECA = 0;

    //   const intervalECA = setInterval(() => {
    //     this.ECAVoucher = Math.round(
    //       startValueECA + incrementECA * currentStepECA
    //     );
    //     currentStepECA++;

    //     if (currentStepECA > totalStepsECA) {
    //       clearInterval(intervalECA);
    //       this.isAnimating = false;
    //       this.ECAVoucher = newValueECA;
    //     }
    //   }, stepTime);
    // },

    async updateVouCounter(newValue) {
      const modules = [
        { id: 1, key: "SEVoucher" },
        { id: 2, key: "AEVoucher" },
        { id: 3, key: "AIVoucher" },
        { id: 4, key: "SIVoucher" },
        { id: 5, key: "ICSVoucher" },
        { id: 6, key: "ICAVoucher" },
        { id: 7, key: "ECSVoucher" },
        { id: 8, key: "ECAVoucher" },
      ];

      this.isAnimating = true;
      const duration = 1000;
      const stepTime = 100;
      const totalSteps = duration / stepTime;

      modules.forEach(({ id, key }) => {
        const logs = newValue.filter((row) => row.ModuleID === id);
        const newVal = logs.length;
        const startVal = this[key] || 0; // Ensure startVal is not undefined
        const increment = (newVal - startVal) / totalSteps;
        let currentStep = 0;

        const interval = setInterval(() => {
          this[key] = Math.round(startVal + increment * currentStep);
          currentStep++;

          if (currentStep > totalSteps) {
            clearInterval(interval);
            this[key] = newVal;
          }
        }, stepTime);
      });

      setTimeout(() => {
        this.isAnimating = false;
      }, duration + 100);
    },
    formatDate(dateField, outputField) {
      const parsedDate = new Date(this[dateField]);
      const day = parsedDate.getDate().toString().padStart(2, "0");
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = parsedDate.getFullYear();
      this[outputField] = `${year}-${month}-${day}`;
    },
    GetUserLogDetailsGrid(branch, user) {
      this.selectedOperation = "I";
      const Doctype = "Doc";
      const from = this.formattedFromDate;
      const To = this.formattedToDate;
      let branchesid = branch ? branch : this.branchid;
      let userid = user ? user : this.userid;
      if (userid.length === 0) {
        userid = this.userid;
      }
      return axios
        .get(
          `${CargoNet_API}/dashboard/shipment/${this.selectedOperation}/${from}/${To}/${branchesid}/${Doctype}/${userid}/${this.selectedCalendarlable}/${this.selectedmodules}`
        )
        .then((res) => {
          const data = res.data;
          // Filter by selected modules
          const selectedModuleIds = Object.keys(this.moduleFields).filter(
            (key) => this.moduleFields[key]
          );
          if (selectedModuleIds.length > 0) {
            const filteredData = data.filter((log) =>
              selectedModuleIds.includes(log.ModuleID.toString())
            );
            this.UserLogGrid = filteredData;
          } else {
            this.UserLogGrid = data;
          }
          return data;
        })
        .catch((err) => {
          console.error("Error fetching user log details:", err);
          this.UserLogGrid = [];
        });
    },

    GetUserLogmonthwiseDetailsGrid(branch, user) {
      this.selectedOperation = "I";
      const Doctype = "Doc";
      const from = this.formattedFromDate;
      const To = this.formattedToDate;
      let branchesid = branch ? branch : this.branchid;
      if (branchesid.length === 0) {
        branchesid = this.branchid;
      }

      let userid = this.isAllSelected ? "All" : user ? user : this.userid;
      if (userid.length === 0) {
        userid = this.userid;
      }
      return axios
        .get(
          `${CargoNet_API}/dashboard/shipmentmonthwise/${this.selectedOperation}/${from}/${To}/${branchesid}/${Doctype}/${userid}/${this.selectedCalendarlable}`
        )
        .then((res) => {
          const data = res.data;
          // Filter by selected modules
          const selectedModuleIds = Object.keys(this.moduleFields).filter(
            (key) => this.moduleFields[key]
          );
          if (selectedModuleIds.length > 0) {
            const filteredData = data.filter((log) =>
              selectedModuleIds.includes(log.ModuleID.toString())
            );
            this.UserLogMonthWiseGrid = filteredData;
          } else {
            this.UserLogMonthWiseGrid = data;
          }
          return data;
        })
        .catch((err) => {
          console.error("Error fetching user log monthwise details:", err);
          this.UserLogMonthWiseGrid = [];
        });
    },
    GetVoucherDetailsGrid(branch, user) {
      this.selectedOperation = "I";
      const Doctype = "Vou";
      const from = this.formattedFromDate;
      const To = this.formattedToDate;
      let branchesid = branch ? branch : this.branchid;
      if (branchesid.length === 0) {
        branchesid = this.branchid;
      }
      let userid = this.isAllSelected ? "All" : user ? user : this.userid;
      if (userid.length === 0) {
        userid = this.userid;
      }
      return axios
        .get(
          `${CargoNet_API}/dashboard/shipment/${this.selectedOperation}/${from}/${To}/${branchesid}/${Doctype}/${userid}/${this.selectedCalendarlable}`
        )
        .then((res) => {
          const data = res.data;
          // Filter by selected modules
          const selectedModuleIds = Object.keys(this.moduleFields).filter(
            (key) => this.moduleFields[key]
          );
          if (selectedModuleIds.length > 0) {
            const filteredData = data.filter((log) =>
              selectedModuleIds.includes(log.ModuleID.toString())
            );
            this.UserLogVoucherGrid = filteredData;
          } else {
            this.UserLogVoucherGrid = data;
          }
          this.updateVouCounter(this.UserLogVoucherGrid);
          return data;
        })
        .catch((err) => {
          console.error("Error fetching voucher details:", err);
          this.UserLogVoucherGrid = [];
        });
    },
    GetVoucherMWDetailsGrid(branch, user) {
      this.selectedOperation = "I";
      const Doctype = "Vou";
      const from = this.formattedFromDate;
      const To = this.formattedToDate;
      let branchesid = branch ? branch : this.branchid;
      if (branchesid.length === 0) {
        branchesid = this.branchid;
      }
      let userid = this.isAllSelected ? "All" : user ? user : this.userid;
      if (userid.length === 0) {
        userid = this.userid;
      }
      return axios
        .get(
          `${CargoNet_API}/dashboard/shipmentmonthwise/${this.selectedOperation}/${from}/${To}/${branchesid}/${Doctype}/${userid}/${this.selectedCalendarlable}`
        )
        .then((res) => {
          this.UserLogVoucherGrid = res.data;
          this.UserLogVoucherMWGrid = res.data;
          this.updateVoucherChart1();
          this.updateVouCounter(this.UserLogVoucherGrid);
          return res.data;
        })
        .catch((err) => {
          console.error("Error fetching voucher monthwise details:", err);
          this.UserLogVoucherGrid = [];
          this.UserLogVoucherMWGrid = [];
        });
    },

    async GetShipmentSummaryGrid(branch, user) {
      this.selectedOperation = "I";
      const from = this.formattedFromDate;
      const To = this.formattedToDate;
      const branchesid = branch ? branch : this.branchid;
      if (branchesid.length === 0) {
        branchesid = this.branchid;
      }

      const userid = user ? user : this.userid;
      if (userid.length === 0) {
        userid = this.userid;
      }
      const Doctype = "Doc";
      await axios
        .get(
          `${CargoNet_API}/dashboard/summary/${this.selectedOperation}/${from}/${To}/${branchesid}/${Doctype}/${userid}/${this.selectedCalendarlable}`
        )
        .then((res) => {
          this.ShipmentDetailsGrid = res.data;
          this.SEShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Sea Export"
          );
          this.AEShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Air Export"
          );
          this.SIShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Sea Import"
          );
          this.AIShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Air Import"
          );
          this.ICSShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Import Clearance Sea"
          );
          this.ICAShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Import Clearance Air"
          );
          this.ECSShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Export Clearance Sea"
          );
          this.ECAShipmentDetailsGrid = res.data.filter(
            (item) => item.Module === "Export Clearance Air"
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async GetVoucherSummaryGrid(branch, user) {
      this.selectedOperation = "I";
      const from = this.formattedFromDate;
      const To = this.formattedToDate;
      const branchesid = branch ? branch : this.branchid;
      if (branchesid.length === 0) {
        branchesid = this.branchid;
      }

      const userid = user ? user : this.userid;
      if (userid.length === 0) {
        userid = this.userid;
      }
      const Doctype = "Vou";
      await axios
        .get(
          `${CargoNet_API}/dashboard/summary/${this.selectedOperation}/${from}/${To}/${branchesid}/${Doctype}/${userid}/${this.selectedCalendarlable}`
        )
        .then((res) => {
          this.VoucherDetailsGrid = res.data;
          this.SEVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Sea Export"
          );
          this.AEVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Air Export"
          );
          this.SIVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Sea Import"
          );
          this.AIVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Air Import"
          );
          this.ICSVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Import Clearance Sea"
          );
          this.ICAVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Import Clearance Air"
          );
          this.ECSVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Export Clearance Sea"
          );
          this.ECAVoucherDetailsGrid = res.data.filter(
            (item) => item.Module === "Export Clearance Air"
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async updateMonthChart() {
      if (this.chartMWInstance) {
        this.chartMWInstance.destroy();
      }

      const moduleCounts = {}; // Keeps track of module counts per month
      const modules = {}; // Keeps track of individual module counts per month
      const allModules = new Set();

      // Build moduleCounts and modules data structures
      this.UserLogMonthWiseGrid.forEach((log) => {
        const month = log.Month; // Assume Month is in a format like 'Jan', 'Feb', etc.
        const module = log.Module;

        // Initialize counts for the month
        if (!moduleCounts[month]) {
          moduleCounts[month] = 0;
        }
        moduleCounts[month] += 1;

        // Track module-specific counts
        if (!modules[month]) {
          modules[month] = {};
        }
        if (!modules[month][module]) {
          modules[month][module] = 0;
        }
        modules[month][module] += 1;
        allModules.add(module);
      });

      // Extract unique months for the x-axis
      const months = Object.keys(moduleCounts);
      // Set up chart options and series
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: months.filter(
            (month) => moduleCounts[month] !== undefined
          ), // Filters to only show months with data
        },
      };

      // this.chartSeries[0] = {
      //   name: "",
      //   data: months.map((month) => moduleCounts[month] || 0),
      // };
      const uniqueModules = Array.from(allModules);
      const months1 = Object.keys(moduleCounts);

      const chartSeries = uniqueModules.map((moduleName) => {
        return {
          name: moduleName,
          data: months1.map((month) =>
            modules[month] && modules[month][moduleName]
              ? modules[month][moduleName]
              : 0
          ),
        };
      });
      this.chartSeries = chartSeries;
      // Update the chart with new options and series
      if (this.chartOptions.length > 0) {
        this.$refs.apexChart.updateOptions(this.chartOptions);
        this.$refs.apexChart.updateSeries(this.chartSeries);
      }
      if (this.AutoWtsAppMsgsts === "Y") {
        const chartImageURI = await this.$refs.apexChart.chart.dataURI();
        this.imgURI = chartImageURI.imgURI;
      }
      // if (this.imgURI) {
      //   this.Chartgenerated = true;
      // }
      // this.generateEmailTemplate();

      if (!this.showAllLogs && this.showMonthLogs) {
        this.updateCounter(this.UserLogMonthWiseGrid);
      }
      if (!this.showAllLogs && this.showWeekLogs) {
        this.updateCounter(this.UserLogMonthWiseGrid);
      }
      if (!this.showAllLogs && this.showDayLogs) {
        this.updateCounter(this.UserLogMonthWiseGrid);
      }
    },

    async updateMonthChart1() {
      if (this.chartMWInstance) {
        this.chartMWInstance.destroy();
      }

      const moduleCounts = {};
      const modules = {};
      const moduleWeekCounts = {};
      const moduleDayCounts = {};
      const allModules = new Set();

      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 1);

      const WeekLogs = this.UserLogMonthWiseGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 7;
      });

      const DayLogs = this.UserLogMonthWiseGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 1;
      });

      DayLogs.forEach((log) => {
        moduleDayCounts[log.Date] = (moduleDayCounts[log.Date] || 0) + 1;
      });
      WeekLogs.forEach((log) => {
        moduleWeekCounts[log.Date] = (moduleWeekCounts[log.Date] || 0) + 1;
      });
      if (this.showDayLogs) {
        // Build moduleCounts and modules data structures based on exact dates
        DayLogs.forEach((log) => {
          const date = log.Date; // Assuming Date is in format 'YYYY-MM-DD'
          const module = log.Module;

          // Initialize counts for the date
          if (!moduleCounts[date]) {
            moduleCounts[date] = 0;
          }
          moduleCounts[date] += 1;

          // Track module-specific counts per date
          if (!modules[date]) {
            modules[date] = {};
          }
          if (!modules[date][module]) {
            modules[date][module] = 0;
          }
          modules[date][module] += 1;
          allModules.add(module);
        });

        // Generate date labels from available dates in `UserLogMonthWiseGrid`
        const dateLabels = Object.keys(moduleCounts).sort();

        // Set up chart options with date labels for the x-axis
        this.chartOptions1 = {
          ...this.chartOptions1,
          xaxis: {
            ...this.chartOptions1.xaxis,
            categories: dateLabels, // Use date labels instead of just months
          },
        };

        // Create chart series for each unique module
        const uniqueModules = Array.from(allModules);
        const chartSeries = uniqueModules.map((moduleName) => {
          return {
            name: moduleName,
            data: dateLabels.map((dateLabel) => {
              return modules[dateLabel] && modules[dateLabel][moduleName]
                ? modules[dateLabel][moduleName]
                : 0;
            }),
          };
        });

        this.chartSeries1 = chartSeries;
        // Update the chart with new options and series
      } else if (this.showWeekLogs) {
        // Build moduleCounts and modules data structures based on exact dates
        WeekLogs.forEach((log) => {
          const date = log.Date; // Assuming Date is in format 'YYYY-MM-DD'
          const module = log.Module;

          // Initialize counts for the date
          if (!moduleWeekCounts[date]) {
            moduleWeekCounts[date] = 0;
          }
          moduleWeekCounts[date] += 1;

          // Track module-specific counts per date
          if (!modules[date]) {
            modules[date] = {};
          }
          if (!modules[date][module]) {
            modules[date][module] = 0;
          }
          modules[date][module] += 1;
          allModules.add(module);
        });

        // Generate date labels from available dates in `UserLogMonthWiseGrid`
        const dateLabels = Object.keys(moduleWeekCounts).sort();

        // Set up chart options with date labels for the x-axis
        this.chartOptions1 = {
          ...this.chartOptions1,
          xaxis: {
            ...this.chartOptions1.xaxis,
            categories: dateLabels, // Use date labels instead of just months
          },
        };

        // Create chart series for each unique module
        const uniqueModules = Array.from(allModules);
        const chartSeries = uniqueModules.map((moduleName) => {
          return {
            name: moduleName,
            data: dateLabels.map((dateLabel) => {
              return modules[dateLabel] && modules[dateLabel][moduleName]
                ? modules[dateLabel][moduleName]
                : 0;
            }),
          };
        });

        this.chartSeries1 = chartSeries;
        // Update the chart with new options and series
      } else {
        // Build moduleCounts and modules data structures based on exact dates
        this.UserLogMonthWiseGrid.forEach((log) => {
          const date = log.Date; // Assuming Date is in format 'YYYY-MM-DD'
          const module = log.Module;

          // Initialize counts for the date
          if (!moduleCounts[date]) {
            moduleCounts[date] = 0;
          }
          moduleCounts[date] += 1;

          // Track module-specific counts per date
          if (!modules[date]) {
            modules[date] = {};
          }
          if (!modules[date][module]) {
            modules[date][module] = 0;
          }
          modules[date][module] += 1;
          allModules.add(module);
        });

        // Generate date labels from available dates in `UserLogMonthWiseGrid`
        const dateLabels = Object.keys(moduleCounts).sort();

        // Set up chart options with date labels for the x-axis
        this.chartOptions1 = {
          ...this.chartOptions1,
          xaxis: {
            ...this.chartOptions1.xaxis,
            categories: dateLabels, // Use date labels instead of just months
          },
        };

        // Create chart series for each unique module
        const uniqueModules = Array.from(allModules);
        const chartSeries = uniqueModules.map((moduleName) => {
          return {
            name: moduleName,
            data: dateLabels.map((dateLabel) => {
              return modules[dateLabel] && modules[dateLabel][moduleName]
                ? modules[dateLabel][moduleName]
                : 0;
            }),
          };
        });

        this.chartSeries1 = chartSeries;
        // Update the chart with new options and series
      }
      if (this.chartOptions1.length > 0) {
        this.$refs.apexChart.updateOptions(this.chartOptions1);
        this.$refs.apexChart.updateSeries(this.chartSeries1);
      }

      if (!this.showAllLogs && this.showMonthLogs) {
        this.updateCounter(this.UserLogMonthWiseGrid);
      }
      if (!this.showAllLogs && this.showWeekLogs) {
        this.updateCounter(this.UserLogMonthWiseGrid);
      }
      if (!this.showAllLogs && this.showDayLogs) {
        this.updateCounter(this.UserLogMonthWiseGrid);
      }
    },

    updateVoucherChart() {
      const moduleCounts = {}; // Keeps track of module counts per month
      const modules = {}; // Keeps track of individual module counts per month
      const allModules = new Set();

      // Build moduleCounts and modules data structures
      this.UserLogVoucherGrid.forEach((log) => {
        const month = log.Month; // Assume Month is in a format like 'Jan', 'Feb', etc.
        const module = log.Module;

        // Initialize counts for the month
        if (!moduleCounts[month]) {
          moduleCounts[month] = 0;
        }
        moduleCounts[month] += 1;

        // Track module-specific counts
        if (!modules[month]) {
          modules[month] = {};
        }
        if (!modules[month][module]) {
          modules[month][module] = 0;
        }
        modules[month][module] += 1;
        allModules.add(module);
      });

      // Extract unique months for the x-axis
      const months = Object.keys(moduleCounts);
      // Set up chart options and series
      this.VchartOptionsAll = {
        ...this.VchartOptionsAll,
        xaxis: {
          ...this.VchartOptionsAll.xaxis,
          categories: months.filter(
            (month) => moduleCounts[month] !== undefined
          ),
        },
      };

      // this.chartSeries[0] = {
      //   name: "",
      //   data: months.map((month) => moduleCounts[month] || 0),
      // };
      const uniqueModules = Array.from(allModules);
      const months1 = Object.keys(moduleCounts);
      const chartSeries = uniqueModules.map((moduleName) => {
        return {
          name: moduleName,
          data: months1.map((month) =>
            modules[month] && modules[month][moduleName]
              ? modules[month][moduleName]
              : 0
          ),
        };
      });
      this.VchartSeriesAll = chartSeries;
      // Update the chart with new options and series

      if (this.VchartOptionsAll.length > 0) {
        this.$refs.apexChart.updateOptions(this.VchartOptionsAll);
        this.$refs.apexChart.updateSeries(this.VchartSeriesAll);
      }
      if (this.AutoWtsAppMsgsts === "Y") {
        const chartImageURI = this.$refs.apexChartVoucher.chart.dataURI();
        this.imgURIVoucher = chartImageURI.imgURI;
      }

      // if (!this.showAllLogs && this.showMonthLogs) {
      //   this.updateVouCounter(this.UserLogVoucherGrid);
      // }
      // if (!this.showAllLogs && this.showWeekLogs) {
      //   this.updateVouCounter(this.UserLogVoucherGrid);
      // }
      // if (!this.showAllLogs && this.showDayLogs) {
      //   this.updateVouCounter(this.UserLogVoucherGrid);
      // }
    },
    updateVoucherChart1() {
      const moduleCounts = {}; // Total counts per exact date
      const modules = {}; // Individual module counts per exact date
      const moduleWeekCounts = {};
      const moduleDayCounts = {};
      const allModules = new Set();

      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 1);

      const WeekLogs = this.UserLogVoucherGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 7;
      });

      const DayLogs = this.UserLogVoucherGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 1;
      });

      DayLogs.forEach((log) => {
        moduleDayCounts[log.Date] = (moduleDayCounts[log.Date] || 0) + 1;
      });
      WeekLogs.forEach((log) => {
        moduleWeekCounts[log.Date] = (moduleWeekCounts[log.Date] || 0) + 1;
      });
      if (this.showDayLogs) {
        // Build moduleCounts and modules data structures based on exact dates
        DayLogs.forEach((log) => {
          const date = log.Date; // Assuming Date is in format 'YYYY-MM-DD'
          const module = log.Module;

          // Initialize counts for the date
          if (!moduleCounts[date]) {
            moduleCounts[date] = 0;
          }
          moduleCounts[date] += 1;

          // Track module-specific counts per date
          if (!modules[date]) {
            modules[date] = {};
          }
          if (!modules[date][module]) {
            modules[date][module] = 0;
          }
          modules[date][module] += 1;
          allModules.add(module);
        });

        // Generate date labels from available dates in `UserLogMonthWiseGrid`
        const dateLabels = Object.keys(moduleCounts).sort();

        // Set up chart options with date labels for the x-axis
        this.VchartOptions = {
          ...this.VchartOptions,
          xaxis: {
            ...this.VchartOptions.xaxis,
            categories: dateLabels, // Use date labels instead of just months
          },
        };

        // Create chart series for each unique module
        const uniqueModules = Array.from(allModules);
        const chartSeries = uniqueModules.map((moduleName) => {
          return {
            name: moduleName,
            data: dateLabels.map((dateLabel) => {
              return modules[dateLabel] && modules[dateLabel][moduleName]
                ? modules[dateLabel][moduleName]
                : 0;
            }),
          };
        });

        this.VchartSeries = chartSeries;
        // Update the chart with new options and series
      } else if (this.showWeekLogs) {
        // Build moduleCounts and modules data structures based on exact dates
        WeekLogs.forEach((log) => {
          const date = log.Date; // Assuming Date is in format 'YYYY-MM-DD'
          const module = log.Module;

          // Initialize counts for the date
          if (!moduleWeekCounts[date]) {
            moduleWeekCounts[date] = 0;
          }
          moduleWeekCounts[date] += 1;

          // Track module-specific counts per date
          if (!modules[date]) {
            modules[date] = {};
          }
          if (!modules[date][module]) {
            modules[date][module] = 0;
          }
          modules[date][module] += 1;
          allModules.add(module);
        });

        // Generate date labels from available dates in `UserLogMonthWiseGrid`
        const dateLabels = Object.keys(moduleWeekCounts).sort();

        // Set up chart options with date labels for the x-axis
        this.VchartOptions = {
          ...this.VchartOptions,
          xaxis: {
            ...this.VchartOptions.xaxis,
            categories: dateLabels, // Use date labels instead of just months
          },
        };

        // Create chart series for each unique module
        const uniqueModules = Array.from(allModules);
        const chartSeries = uniqueModules.map((moduleName) => {
          return {
            name: moduleName,
            data: dateLabels.map((dateLabel) => {
              return modules[dateLabel] && modules[dateLabel][moduleName]
                ? modules[dateLabel][moduleName]
                : 0;
            }),
          };
        });

        this.VchartSeries = chartSeries;
        // Update the chart with new options and series
      } else {
        // Build moduleCounts and modules data structures based on exact dates
        this.UserLogVoucherGrid.forEach((log) => {
          const date = log.Date; // Assuming Date is in format 'YYYY-MM-DD'
          const module = log.Module;

          // Initialize counts for the date
          if (!moduleCounts[date]) {
            moduleCounts[date] = 0;
          }
          moduleCounts[date] += 1;

          // Track module-specific counts per date
          if (!modules[date]) {
            modules[date] = {};
          }
          if (!modules[date][module]) {
            modules[date][module] = 0;
          }
          modules[date][module] += 1;
          allModules.add(module);
        });

        // Generate date labels from available dates in `UserLogMonthWiseGrid`
        const dateLabels = Object.keys(moduleCounts).sort();

        // Set up chart options with date labels for the x-axis
        this.VchartOptions = {
          ...this.VchartOptions,
          xaxis: {
            ...this.VchartOptions.xaxis,
            categories: dateLabels, // Use date labels instead of just months
          },
        };

        // Create chart series for each unique module
        const uniqueModules = Array.from(allModules);
        const chartSeries = uniqueModules.map((moduleName) => {
          return {
            name: moduleName,
            data: dateLabels.map((dateLabel) => {
              return modules[dateLabel] && modules[dateLabel][moduleName]
                ? modules[dateLabel][moduleName]
                : 0;
            }),
          };
        });

        this.VchartSeries = chartSeries;
        // Update the chart with new options and series
      }
      if (this.chartOptions1.length > 0) {
        this.$refs.apexChart.updateSeries(this.VchartSeries);
      }
      // if (!this.showAllLogs && this.showMonthLogs) {
      //   this.updateVouCounter(this.UserLogVoucherGrid);
      // }
      // if (!this.showAllLogs && this.showWeekLogs) {
      //   this.updateVouCounter(this.UserLogVoucherGrid);
      // }
      // if (!this.showAllLogs && this.showDayLogs) {
      //   this.updateVouCounter(this.UserLogVoucherGrid);
      // }
    },
    updateVoucherMonthChart() {
      // Process data to get the counts per module and user
      const moduleCounts = {};
      const modules = {};
      const moduleDayCounts = {};
      const moduleWeekCounts = {};
      const moduleMonthCounts = {};

      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 1);

      const DayLogs = this.UserLogVoucherMWGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 1;
      });

      const WeekendDate = new Date();
      const WeekstartDate = new Date(endDate);
      WeekstartDate.setDate(endDate.getDate() - 7);

      const WeekLogs = this.UserLogVoucherMWGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 7;
      });

      const MonthLogs = this.UserLogVoucherMWGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 30;
      });

      // Count logs for different periods
      DayLogs.forEach((log) => {
        moduleDayCounts[log.Month] = (moduleDayCounts[log.Month] || 0) + 1;
      });

      WeekLogs.forEach((log) => {
        moduleWeekCounts[log.Month] = (moduleWeekCounts[log.Month] || 0) + 1;
      });

      MonthLogs.forEach((log) => {
        moduleMonthCounts[log.Month] = (moduleMonthCounts[log.Month] || 0) + 1;
      });

      this.UserLogVoucherMWGrid.forEach((log) => {
        moduleCounts[log.Month] = (moduleCounts[log.Month] || 0) + 1;
      });

      // this.UserLogVoucherGrid.forEach((log) => {
      //   const module = log.Module;
      //   const date = log.Date;

      //   // Initialize the module object if not already present
      //   if (!modules[module]) {
      //     modules[module] = {};
      //   }

      //   // Increment the count for the specific module and date
      //   modules[module][date] = (modules[module][date] || 0) + 1;
      // });

      this.UserLogVoucherMWGrid.forEach((log) => {
        const module = log.Module;
        const date = log.Month;

        // Step 1: Initialize the date object if not already present
        if (!modules[date]) {
          modules[date] = {};
        }

        // Step 2: Initialize the module within the date if not already present
        if (!modules[date][module]) {
          modules[date][module] = 0;
        }

        // Step 3: Increment the count for the specific date and module
        modules[date][module] += 1;
      });

      // Create gradients for the chart

      const createGradient = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "#ffbf96");
        gradient.addColorStop(1, "#ff376d");
        return gradient;
      };

      const createGradient1 = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "#2fa2ff");
        gradient.addColorStop(1, "#047edf");
        return gradient;
      };

      const createGradient2 = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "#2adbcb");
        gradient.addColorStop(1, "#15ddbf");
        return gradient;
      };

      const createGradient3 = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "#f58861");
        gradient.addColorStop(1, "#fb8f2d");
        return gradient;
      };

      // Create the chart based on the checkbox values
      const ctx = document.getElementById("dashboard-chart-4").getContext("2d");
      const datasets = [
        {
          label: "",
          data: "",
          pointRadius: 4,
          borderColor: createGradient(ctx),
          borderWidth: 2,
          lineTension: 1,
          fill: false,
          backgroundColor: createGradient(ctx),
        },
      ];
      if (this.showAllLogs) {
        datasets.push({
          label: "",
          data: Object.values(moduleCounts),
          pointRadius: 4,
          borderColor: createGradient(ctx),
          borderWidth: 2,
          lineTension: 0.4,
          fill: false,
          backgroundColor: createGradient(ctx),
        });
      }
      // Destroy previous chart instance if it exists
      if (this.VouchartMWInstance) {
        this.VouchartMWInstance.destroy();
      }
      var graph = Chart.getChart("dashboard-chart-4");
      if (graph) {
        graph.destroy();
      }

      const moduleNames = Object.keys(modules);
      // Create the module chart
      this.VouchartMWInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: Object.keys(moduleCounts),
          datasets: datasets,
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const date = tooltipItem.label; // This is the date (from labels)
                  const moduleData = modules[date]; // Get the module data for this date

                  // Construct tooltip message: show both module names and counts
                  let tooltipLabels = [];
                  for (const [moduleName, count] of Object.entries(
                    moduleData
                  )) {
                    tooltipLabels.push(
                      `Module: ${moduleName}, Count: ${count}`
                    );
                  }
                  // Join all module data into a single string for the tooltip
                  return `${tooltipLabels.join(" / ")}`;
                },
              },
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(0, 0, 0, 0.5)",
              borderWidth: 1,
              titleColor: "#000",
              bodyColor: "#000",
              padding: 10,
              titleFont: {
                size: 18, // Font size for the title
                family: "Arial", // Font family for the title
                weight: "bold", // Font weight for the title
                color: "#000", // Title color
              },
              bodyFont: {
                size: 15, // Font size for the body
                family: "Rajdhani", // Font family for the body
                weight: "normal", // Font weight for the body
                color: "#000", // Body text color
              },
            },
          },
        },
      });
      // if (!this.showAllLogs && this.showMonthLogs) {
      //   // this.updateCounter(MonthLogs);
      //   this.updateVouCounter(this.UserLogVoucherMWGrid);
      // }
      // if (!this.showAllLogs && this.showWeekLogs) {
      //   // this.updateCounter(WeekLogs);
      //   this.updateVouCounter(this.UserLogVoucherMWGrid);
      // }
      // if (!this.showAllLogs && this.showDayLogs) {
      //   // this.updateCounter(DayLogs);
      //   this.updateVouCounter(this.UserLogVoucherMWGrid);
      // }
    },
    handleClick(event) {
      const selected = this.chartInstance;
      const activePoints = this.chartInstance.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        true
      );

      const DayLogs = this.UserLogGrid.filter((log) => {
        const logDate = log.Days;
        return logDate <= 1;
      });
    },

    async LoadBranchFields() {
      try {
        const response = MOCK_LOGIN_MODE
          ? { data: buildMockBranchFields() }
          : await axios.get(`${CargoNet_API}/branches/${this.userid}`);
        this.branch = response.data.map((Fields) => ({
          label: Fields.Branchcode,
          value: Fields.BranchID,
        }));
      } catch (error) {
        console.log(error);
      }
      this.loadBranchFromSession();
    },

    LoadModules() {
      axios
        .get(`${CargoNet_API}/industrydata/quotefor`)
        .then((res) => {
          this.modules = res.data.map((modules) => ({
            label: modules.name,
            value: modules.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async Checkadminusers() {
      await axios
        .get(`${CargoNet_API}/industrydata/isadmin/${this.userid}`)
        .then((res) => {
          this.isadmin = res.data[0].Status;
        })
        .catch((error) => {
          console.log(error);
        });

      // if (this.isadmin === "Y") {
      //   this.isAllSelected = true;
      // }
    },
    async LoadUsers() {
      await axios
        .get(`${CargoNet_API}/industrydata/userfromlog`)
        .then((res) => {
          if (this.isadmin === "Y") {
            this.Users = res.data.map((User) => ({
              label: User.name,
              value: User.id,
            }));

            this.isAllSelected = true;
            this.Userreadonly = false;
          } else if (this.isadmin === "N") {
            this.Users = [
              {
                label: this.username,
                value: parseFloat(this.userid),
              },
            ];
            this.Userreadonly = true;
          } else {
            this.LoadUsers();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateNewField() {
      //

      this.updatedFields = await Object.keys(this.selectedFields).filter(
        (key) => this.selectedFields[key]
      );
      this.updateduserFields = await Object.keys(this.userFields).filter(
        (key) => this.userFields[key]
      );
    },
    updateBranch(selectedValue) {
      if (this.selectedbranch === "") {
        // this.selectedbranch = this.branchid;
      }
      if (this.selecteduser === "") {
        this.selecteduser = this.userid;
      }

      let selectedArray = this.selectedbranch
        ? this.selectedbranch.split(",")
        : [];

      if (selectedArray.includes(selectedValue)) {
        selectedArray = selectedArray.filter(
          (value) => value !== selectedValue
        );
      } else {
        selectedArray.push(selectedValue);
      }
      this.selectedbranch = selectedArray.join(",");
      this.GetUserLogDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetUserLogmonthwiseDetailsGrid(
        this.selectedbranch,
        this.selecteduser
      );
      this.GetVoucherDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetVoucherMWDetailsGrid(this.selectedbranch, this.selecteduser);
    },
    isUserDisabled(userValue) {
      return this.userid.includes(userValue);
    },
    isBranchDisabled(userValue) {
      if (this.branchid !== null || this.branchid !== "") {
        return this.branchid.includes(userValue);
      } else {
      }
    },
    updateUser(selectedValue) {
      if (this.selectedbranch === "") {
        this.selectedbranch = this.branchid;
      }
      if (this.selecteduser === "") {
        this.selecteduser = this.userid;
      }

      let selectedArray = this.selecteduser ? this.selecteduser.split(",") : [];

      if (selectedArray.includes(selectedValue)) {
        selectedArray = selectedArray.filter(
          (value) => value !== selectedValue
        );
      } else {
        // If the value is not in the list, add it (checkbox checked)
        selectedArray.push(selectedValue);
      }

      // Convert the array back into a comma-separated string
      this.selecteduser = selectedArray.join(",");
      this.GetUserLogDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetUserLogmonthwiseDetailsGrid(
        this.selectedbranch,
        this.selecteduser
      );
      this.GetVoucherDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetVoucherMWDetailsGrid(this.selectedbranch, this.selecteduser);
    },
    updateCalender(selectedValue) {
      for (let key in this.selectedCalendar) {
        this.selectedCalendar[key] = key === selectedValue;
      }

      if (selectedValue === "day") {
        this.showDayLogs = true;
        this.showWeekLogs = false;
        this.showMonthLogs = false;
        this.showAllLogs = false;
        this.selectedCalendarlable = "day";
      } else if (selectedValue === "week") {
        this.showDayLogs = false;
        this.showWeekLogs = true;
        this.showMonthLogs = false;
        this.showAllLogs = false;
        this.selectedCalendarlable = "week";
      } else if (selectedValue === "month") {
        this.showDayLogs = false;
        this.showWeekLogs = false;
        this.showMonthLogs = true;
        this.showAllLogs = false;
        this.selectedCalendarlable = "month";
      } else {
        this.showDayLogs = false;
        this.showWeekLogs = false;
        this.showMonthLogs = false;
        this.showAllLogs = true;
        this.selectedCalendarlable = "All";
      }

      this.GetUserLogDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetUserLogmonthwiseDetailsGrid(
        this.selectedbranch,
        this.selecteduser
      );
      this.GetVoucherDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetVoucherMWDetailsGrid(this.selectedbranch, this.selecteduser);
    },
    updateDateRange(newDateRange, Preset) {
      this.dateRange = newDateRange;
      if (newDateRange.from) {
        this.TXTFromDate = this.formatDateToString(newDateRange.from);
      }
      if (newDateRange.to) {
        this.TXTToDate = this.formatDateToString(newDateRange.to);
      }
      this.updateCalender(Preset);
      // // Trigger data refresh if needed
      this.GetUserLogDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetUserLogmonthwiseDetailsGrid(
        this.selectedbranch,
        this.selecteduser
      );
      this.GetVoucherDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetVoucherMWDetailsGrid(this.selectedbranch, this.selecteduser);
    },
    formatDateToString(date) {
      if (!date) return null;

      // ensure it's a Date object
      const d = date instanceof Date ? date : new Date(date);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}/${month}/${day}`;
    },
    loadBranchFromSession() {
      const matchingBranch = this.branch.find(
        (field) => field.value === this.branchid
      );

      if (matchingBranch) {
        this.selectedFields[matchingBranch.label] = true;
      }
      this.updateNewField();
    },
    loadUserFromSession() {
      let uid = parseFloat(this.userid);
      const matchinguser = this.Users.find((field) => field.value === uid);

      if (matchinguser && this.isadmin === "N") {
        this.userFields[matchinguser.label] = true;
      } else if (this.isadmin === "Y") {
        this.Users.forEach((user) => {
          this.userFields[user.label] = true;
        });
        this.updateAllUser();
      }
      this.updateNewField();
    },

    uncheckall() {
      this.showLoading();
      if (this.isAllSelected) {
        this.Users.forEach((user) => {
          this.userFields[user.label] = !this.userFields[user.label];
        });
        let uid = parseFloat(this.userid);
        const matchinguser = this.Users.find((field) => field.value === uid);
        if (matchinguser) {
          this.userFields[matchinguser.label] = true;
        }
        this.updateNoUser();
        this.isAllSelected = !this.isAllSelected;
      } else {
        this.Users.forEach((user) => {
          this.userFields[user.label] = true;
        });
        this.updateAllUser();
        this.isAllSelected = !this.isAllSelected;
      }
      this.updateNewField();
    },

    updateAllUser() {
      const allusers = this.Users.map((user) => user.value);
      this.selecteduser = allusers.join(",");
      this.GetUserLogDetailsGrid(this.selectedbranch, "All");
      this.GetUserLogmonthwiseDetailsGrid(this.selectedbranch, "All");
      this.GetVoucherDetailsGrid(this.selectedbranch, "All");
      this.GetVoucherMWDetailsGrid(this.selectedbranch, "All");
      this.$q.loading.hide();
    },
    updateNoUser() {
      const user = parseFloat(this.userid);
      this.selecteduser = this.userid;
      this.GetUserLogDetailsGrid(this.selectedbranch, user);
      this.GetUserLogmonthwiseDetailsGrid(this.selectedbranch, user);
      this.GetVoucherDetailsGrid(this.selectedbranch, user);
      this.GetVoucherMWDetailsGrid(this.selectedbranch, user);
      this.$q.loading.hide();
    },
    toggleVisibility() {
      this.isUserVisible = !this.isUserVisible;
    },
    toggleBranchVisibility() {
      this.isBranchVisible = !this.isBranchVisible;
    },
    toggleCalenderVisibility() {
      this.isCalenderVisible = !this.isCalenderVisible;
    },
    getBackgroundColor(value) {
      const colors = {
        All: "linear-gradient(90deg, #ffbf96, #ff376d)",
        day: "linear-gradient(-90deg, #2fa2ff, #047edf)",
        week: "linear-gradient(-90deg, #2adbcb, #15ddbf)",
        month: "linear-gradient(45deg, #f58861, #fb8f2d)",
      };
      return colors[value] || "#FFFFFF"; // Default color if no match
    },
    async GetEIPostURL() {
      await axios
        .get(`${CargoNet_API}/dashboard/getwpurl/`)
        .then((res) => {
          this.WhatsappPostURL = res.data[0].WPPostURL;
          // console.log(this.WhatsappPostURL);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async sendwhatsappmsg() {
      try {
        const sURL1 = this.WhatsappPostURL + 0; // Replace with your URL
        const data = { key: "value" }; // JSON data to send

        await fetch(sURL1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((responseData) => {
            this.Submissionresponse = responseData.data;
            console.log(this.Submissionresponse);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    },
    loadSavedFilters() {
      const saved = localStorage.getItem("applyFiltersState");
      if (!saved) return;

      try {
        const f = JSON.parse(saved);

        // Load date range
        if (f.localDateRange) {
          this.dateRange = f.localDateRange;
          if (this.dateRange.from) {
            this.TXTFromDate = this.formatDateToString(this.dateRange.from);
          }
          if (this.dateRange.to) {
            this.TXTToDate = this.formatDateToString(this.dateRange.to);
          }
        }

        // Load selected preset
        if (f.selectedPreset) {
          this.selectedCalendarlable = f.selectedPreset;
        }

        // For users and branches, we need to wait for the data to be loaded
        // So we'll set flags and apply them later
        this.pendingSavedFilters = f;
      } catch (error) {
        console.error("Error loading saved filters:", error);
      }
    },

    applyPendingSavedFilters() {
      if (!this.pendingSavedFilters) return;

      const f = this.pendingSavedFilters;

      // Load users - convert from localUsers object to selecteduser string
      const selectedUserIds = [];
      if (f.localUsers && this.Users.length > 0) {
        Object.keys(f.localUsers).forEach((userLabel) => {
          if (f.localUsers[userLabel]) {
            const user = this.Users.find((u) => u.label === userLabel);
            if (user) {
              selectedUserIds.push(user.value);
            }
          }
        });
      }
      if (selectedUserIds.length > 0) {
        this.selecteduser = selectedUserIds.join(",");
      }

      // Load branches - convert from localBranch object to selectedbranch string
      const selectedBranchIds = [];
      if (f.localBranch && this.branch.length > 0) {
        Object.keys(f.localBranch).forEach((branchLabel) => {
          if (f.localBranch[branchLabel]) {
            const branch = this.branch.find((b) => b.label === branchLabel);
            if (branch) {
              selectedBranchIds.push(branch.value);
            }
          }
        });
      }
      if (selectedBranchIds.length > 0) {
        this.selectedbranch = selectedBranchIds.join(",");
      }

      // Load modules
      if (f.localModules && this.modules.length > 0) {
        Object.keys(f.localModules).forEach((moduleLabel) => {
          if (f.localModules[moduleLabel]) {
            const module = this.modules.find(
              (m) => m.Description === moduleLabel
            );
            if (module) {
              this.moduleFields[module.Description] = true;
            }
          }
        });
      }

      // Clear pending filters
      this.pendingSavedFilters = null;

      // Apply the filters to load data
      this.GetUserLogDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetUserLogmonthwiseDetailsGrid(
        this.selectedbranch,
        this.selecteduser
      );
      this.GetVoucherDetailsGrid(this.selectedbranch, this.selecteduser);
      this.GetVoucherMWDetailsGrid(this.selectedbranch, this.selecteduser);
    },
    GetDynamicConfig() {
      axios
        .get(`${CargoNet_API}/Configuration/cargonetconfigflag/0`)
        .then((res) => {
          this.Masterflag = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleSeries(type, name) {
      if (type === "shipment") {
        const chart = this.$refs.apexChart.chart;
        this.chartSeries.forEach((s) => {
          if (s.name === name) chart.showSeries(s.name);
          else chart.hideSeries(s.name);
        });
        this.chartSeries.showSeries(name);
      } else {
        const chart = this.$refs.apexChartVoucher.chart;
        this.VchartSeriesAll.forEach((s) => {
          if (s.name === name) chart.showSeries(s.name);
          else chart.hideSeries(s.name);
        });
        this.VchartSeriesAll.showSeries(name);
      }
    },
    applyFilters(data) {
      this.dateRange = data.dateRange;
      if (this.dateRange.from) {
        this.TXTFromDate = this.formatDateToString(this.dateRange.from);
      }
      if (this.dateRange.to) {
        this.TXTToDate = this.formatDateToString(this.dateRange.to);
      }

      // Convert arrays to comma-separated strings
      this.selecteduser = Array.isArray(data.users)
        ? data.users.join(",")
        : data.users;
      this.selectedbranch = Array.isArray(data.branches)
        ? data.branches.join(",")
        : data.branches;

      const Preset = data.selectedPreset;
      this.updateCalender(Preset);

      // Update module fields
      if (data.modules && Array.isArray(data.modules)) {
        this.selectedmodules = data.modules.join(",");
        // Reset module fields
        Object.keys(this.moduleFields).forEach((key) => {
          this.moduleFields[key] = false;
        });
        // Set selected modules
        data.modules.forEach((moduleId) => {
          const module = this.modules.find((m) => m.ID == moduleId);
          if (module) {
            this.moduleFields[module.Description] = true;
          }
        });
      }

      // Trigger data refresh - use Promise.all for parallel API calls
      Promise.all([
        this.GetUserLogDetailsGrid(this.selectedbranch, this.selecteduser),
        this.GetUserLogmonthwiseDetailsGrid(
          this.selectedbranch,
          this.selecteduser
        ),
        this.GetVoucherDetailsGrid(this.selectedbranch, this.selecteduser),
        this.GetVoucherMWDetailsGrid(this.selectedbranch, this.selecteduser),
      ]).catch((err) => {
        console.error("Error refreshing dashboard data:", err);
      });
    },
    handleOptionClick(option) {
      this.selectedDashboard = option.value;
      sessionStorage.setItem("selectedDashboard", option.value);
      if (this.openTab) {
        this.openTab(`/${option.value}`, option.label);
      } else {
        this.$router.push(`/${option.value}`);
      }
    },
  },
};
</script>

<style scoped>
/* Dashboard metric icons: one positioning/color system at every breakpoint.
   This overrides legacy float-based rules that changed with viewport width. */
.folder .ml2-metric-card {
  position: relative;
  overflow: hidden;
}
.folder .ml2-metric-card .card-body {
  position: relative;
  padding: 20px 22px 18px;
  overflow: hidden;
}
.folder .ml2-metric-card .ml2-metric-top {
  position: relative;
  z-index: 2;
  min-height: 44px;
  margin: 0;
}
.folder .ml2-metric-card .ml2-metric-label {
  max-width: calc(100% - 82px);
  color: #fff !important;
  text-shadow: 0 1px 2px rgba(0, 46, 76, 0.2);
}
.folder .ml2-metric-card .card-inner {
  position: absolute;
  top: -4px;
  right: 0;
  z-index: 3;
  display: flex;
  width: 46px;
  height: 46px;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  box-shadow: none;
}
.folder .ml2-metric-card .card-img {
  position: static !important;
  display: block;
  width: 60px !important;
  height: 60px !important;
  margin: 0 20px 0 0 !important;
  padding: 0 !important;
  float: none !important;
  object-fit: contain;
  opacity: 1 !important;
  filter: brightness(0) invert(1) !important;
}
.folder .ml2-metric-card .DB-Font {
  position: relative;
  z-index: 2;
  margin: 0px 0 1px;
  line-height: 1;
}
.folder .ml2-metric-card .DB-Inner-Font {
  position: relative;
  z-index: 2;
  font-size: 14px;
  display: block;
}
@media (min-width: 1500px) and (max-width: 1700px) {
  .folder .ml2-metric-card .card-img[data-v-650eb1cf] {
    position: static !important;
    display: block;
    width: 50px !important;
    height: 50px !important;
    margin: 0 0px 0 0 !important;
    padding: 0 !important;
    float: none !important;
    object-fit: contain;
    opacity: 1 !important;
    filter: brightness(0) invert(1) !important;
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .folder .ml2-metric-card,
  .folder .ml2-metric-card .card-body {
    min-height: 108px;
  }
  .folder .ml2-metric-card .card-body {
    padding: 14px 18px 12px;
  }
  .folder .ml2-metric-card .ml2-metric-top {
    min-height: 34px;
  }
  .folder .ml2-metric-card .ml2-metric-label {
    max-width: calc(100% - 64px);
    font-size: 11px;
  }
  .folder .ml2-metric-card .card-inner {
    top: -3px;
    width: 38px;
    height: 38px;
  }
  .folder .ml2-metric-card .card-img {
    width: 38px !important;
    height: 38px !important;
  }
  .folder .ml2-metric-card .DB-Font {
    margin-top: 4px;
    font-size: 29px;
  }
  .folder .ml2-metric-card .DB-Inner-Font {
    font-size: 12px;
    line-height: 14px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .folder .ml2-metric-card,
  .folder .ml2-metric-card .card-body {
    min-height: 118px;
  }
  .folder .ml2-metric-card .card-body {
    padding: 16px 18px 14px;
  }
  .folder .ml2-metric-card .card-inner {
    width: 39px;
    height: 39px;
  }
  .folder .ml2-metric-card .card-img {
    width: 39px !important;
    height: 39px !important;
  }
}

@media (max-width: 767px) {
  .folder .ml2-metric-card,
  .folder .ml2-metric-card .card-body {
    min-height: 76px;
  }
  .folder .ml2-metric-card .card-body {
    padding: 9px 10px 8px;
  }
  .folder .ml2-metric-card .ml2-metric-top {
    min-height: 32px;
  }
  .folder .ml2-metric-card .ml2-metric-label {
    max-width: calc(100% - 44px);
    font-size: 9px;
    line-height: 11px;
  }
  .folder .ml2-metric-card .card-inner {
    top: -3px;
    width: 26px;
    height: 26px;
  }
  .folder .ml2-metric-card .card-img {
    width: 26px !important;
    height: 26px !important;
  }
  .folder .ml2-metric-card .DB-Font {
    margin-top: 1px;
  }
}

/* ApexCharts renders its title and its toolbar (zoom/reset/menu icons) as two
   independent absolutely-positioned elements, so they don't share a baseline
   by default — nudge the toolbar down a touch so it lines up with the title
   text next to it instead of sitting visibly higher. */
:deep(.apexcharts-toolbar) {
  margin-top: 0px !important;
}
:deep(.apexcharts-title-text) {
  dominant-baseline: middle;
}

/* ApexCharts toolbar (reset/menu icons) — with zoom/pan tools disabled on
   mobile, only a couple of icons remain; shrink the toolbar's own width so
   it doesn't reserve more horizontal room than that. */
@media (max-width: 599px) {
  :deep(.apexcharts-toolbar) {
    width: auto !important;
    min-width: 0 !important;
    gap: 2px;
  }
  :deep(.apexcharts-toolbar .apexcharts-menu-icon),
  :deep(.apexcharts-toolbar .apexcharts-reset-icon),
  :deep(.apexcharts-toolbar .apexcharts-selection-icon) {
    padding: 2px;
  }
}
</style>
