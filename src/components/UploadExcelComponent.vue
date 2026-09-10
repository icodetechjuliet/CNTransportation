<template>
  <div>
    <q-card flat class="my-card" text-color="grey-7">
      <!-- DRAG & DROP UPLOAD AREA -->
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-uploader
          ref="uploader"
          url="/api/upload"
          :auto-upload="false"
          @added="onFileAdd"
          label="Drag and drop files here"
          hide-upload-btn
          :multiple="false"
        >
          <template v-slot:header>
            <div class="row justify-center q-mt-sm">
              <!-- Hidden native file input -->
              <input
                ref="fileInput"
                type="file"
                accept=".xls,.xlsx"
                class="hidden"
                @change="(e) => onNativeFileChange(e.target.files)"
              />
            </div>
          </template>

          <!-- DRAG & DROP + FILE LIST -->
          <template v-slot:list="scope">
            <div
              class="q-uploader__files-area q-pa-md"
              style="border: 2px dashed #bdbdbd; border-radius: 6px"
              @dragover.prevent
              @drop.prevent="onDrop($event.dataTransfer.files, scope)"
            >
              <div class="column items-center">
                <q-icon name="cloud_upload" size="2rem" class="q-mb-sm text-grey-6" />
                <div class="text-grey-7">Drag & drop Excel file here</div>
                <div class="text-grey-7 q-py-sm">or</div>
                <div>
                  <q-btn
                    color="primary"
                    label="Select File"
                    :icon="'fa-regular fa-folder-open'"
                    @click="$refs.fileInput.click()"
                  />
                </div>
              </div>

              <!-- FILE LIST -->
              <div class="row justify-center q-mt-sm" v-if="uploadFile">
                <div class="col-xs-12 col-sm-12 col-md-6">
                  <q-item class="m-filename-style" dense>
                    <q-item-section>
                      <q-icon name="description" color="green" class="q-mr-xs" />
                      {{ uploadFile.name }}
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        dense
                        flat
                        :icon="'fa-solid fa-trash-can'"
                        color="negative"
                        @click="removeFile(scope)"
                      />
                    </q-item-section>
                  </q-item>
                </div>
              </div>

              <div class="row justify-center q-mt-xs">
                <div class="col-xs-12 col-sm-12 col-md-7 text-center">
                  <p class="text-caption text-grey-7">
                    <b>Note:</b> Only .xls / .xlsx files are accepted
                  </p>
                </div>
              </div>
            </div>
          </template>
        </q-uploader>
      </div>

      <!-- UPLOAD BUTTON -->
      <div class="row q-col-gutter-sm q-pt-md justify-center">
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-btn
            color="primary"
            label="Upload"
            class="m-btn-style full-width"
            :loading="uploading"
            :disable="!uploadFile"
            @click="onUpload"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>

        <!-- SELECT SHEET DROPDOWN — shown after successful upload -->
        <div class="col-xs-12 col-sm-6 col-md-3" v-if="sheetOptions.length > 0">
          <q-select
            dense
            square
            outlined
            bg-color="blue-1"
            v-model="selectedSheet"
            :options="sheetOptions"
            label="Select Sheet"
            @update:model-value="onSheetSelected"
          />
        </div>

        <!-- UPLOADED FILE NAME DISPLAY -->
        <div
          class="col-xs-12 col-sm-6 col-md-4 flex items-center"
          v-if="savedFileName"
        >
          <q-icon name="check_circle" color="positive" class="q-mr-xs" />
          <span class="text-caption text-grey-8">
            Uploaded: <strong>{{ savedFileName }}</strong>
          </span>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";

export default {
  name: "UploadExcelComponent",

  emits: ["file-uploaded", "sheet-selected", "file-removed"],

  props: {
    uploadUrl: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      uploadFile: null,
      uploading: false,
      sheetOptions: [],
      selectedSheet: null,
      savedFileName: "",
    };
  },

  methods: {
    // ── File added via q-uploader ─────────────────────────────────────────────
    onFileAdd(files) {
      if (this.uploadFile) {
        this.$q.notify({
          message: "Only one file can be uploaded at a time.",
          color: "negative",
          position: "center",
        });
        if (this.$refs.uploader) {
          const queued = this.$refs.uploader.queuedFiles;
          if (queued && queued.length > 0)
            this.$refs.uploader.removeFile(queued[queued.length - 1]);
        }
        return;
      }
      if (files && files.length > 0) {
        this.setFile(files[0]);
      }
    },

    // ── File added via native <input> ─────────────────────────────────────────
    onNativeFileChange(files) {
      if (files && files.length > 0) {
        this.setFile(files[0]);
      }
    },

    // ── File dropped ──────────────────────────────────────────────────────────
    onDrop(files, scope) {
      if (files && files.length > 0) {
        this.setFile(files[0]);
      }
    },

    // ── Validate and set the selected file ───────────────────────────────────
    setFile(file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "xls" && ext !== "xlsx") {
        this.$q.notify({
          message: "Only .xls or .xlsx files are accepted.",
          color: "negative",
          position: "center",
        });
        return;
      }
      this.uploadFile   = file;
      this.sheetOptions = [];
      this.selectedSheet = null;
      this.savedFileName = "";
    },

    // ── Remove selected file ──────────────────────────────────────────────────
    removeFile(scope) {
      if (scope && this.uploadFile) {
        try { scope.removeFile(this.uploadFile); } catch {}
      }
      this.uploadFile    = null;
      this.sheetOptions  = [];
      this.selectedSheet = null;
      this.savedFileName = "";
      if (this.$refs.fileInput) this.$refs.fileInput.value = "";
      this.$emit("file-removed");
    },

    // ── Upload file to API ────────────────────────────────────────────────────
    async onUpload() {
      if (!this.uploadFile) {
        this.$q.notify({ message: "Please select a file.", color: "warning", position: "center" });
        return;
      }

      this.uploading = true;
      try {
        const formData = new FormData();
        formData.append("file", this.uploadFile);

        const url = this.uploadUrl || `${CargoNet_API}/obvoucherupload/uploadfile`;
        const response = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data) {
          this.sheetOptions  = response.data.Sheets || [];
          this.savedFileName = response.data.FileName || "";

          // Emit uploaded event first so parent sets UploadedFileName
          this.$emit("file-uploaded", {
            fileName: this.savedFileName,
            sheets:   this.sheetOptions,
          });

          // Auto-select if only one sheet — emit sheet-selected AFTER file-uploaded
          if (this.sheetOptions.length === 1) {
            this.selectedSheet = this.sheetOptions[0];
            this.$emit("sheet-selected", {
              fileName: this.savedFileName,
              sheet: this.selectedSheet,
            });
          } else {
            this.selectedSheet = null;
          }

          this.$q.notify({
            message: "File uploaded successfully.",
            color: "positive",
            position: "center",
            timeout: 1500,
          });
        }
      } catch (error) {
        console.error(error);
        const msg = error.response?.data || "File upload failed.";
        this.$q.dialog({
          title: "Upload Error",
          message: msg.replace(/\n/g, "<br>"),
          html: true,
          ok: { label: "OK", color: "negative", flat: true },
        });
        // Clear so user must re-select a valid file
        this.removeFile(null);
      } finally {
        this.uploading = false;
      }
    },

    // ── Sheet selected ────────────────────────────────────────────────────────
    onSheetSelected(sheet) {
      this.$emit("sheet-selected", {
        fileName: this.savedFileName,
        sheet,
      });
    },

    // ── Reset the entire component ────────────────────────────────────────────
    reset() {
      this.uploadFile    = null;
      this.sheetOptions  = [];
      this.selectedSheet = null;
      this.savedFileName = "";
      if (this.$refs.fileInput)  this.$refs.fileInput.value = "";
      if (this.$refs.uploader)   this.$refs.uploader.reset();
    },
  },
};
</script>
