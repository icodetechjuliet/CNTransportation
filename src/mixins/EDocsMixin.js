import axios from "axios";
import CargoNet_API from "/src/IPConfig/config.js";
export const EDocsMixin = {
  data() {
    return {
      fabConfig: [
        { key: "MBL", label: "MBL", color: "#ff5722", state: "MBLLabel" },
        { key: "HBL", label: "HBL", color: "#003036", state: "HBLLabel" },
        {
          key: "VendorInv",
          label: "VendorInv",
          color: "#9100bd",
          state: "VendorInvLabel",
        },
        { key: "SB", label: "SB", color: "#6e0034", state: "SBLabel" },
        { key: "OD", label: "OD", color: "#006e68", state: "ODLabel" },
      ],
    };
  },
  methods: {
    LoadCategory() {
      axios
        .get(
          `${CargoNet_API}/industrydata/documenttypecategorymapping/${this.FormID}/${this.BranchID}`
        )

        .then((response) => {
          this.opEdocscategory = response.data.map((optioncategory) => ({
            value: optioncategory.categoryID,
            label: optioncategory.category,
          }));
        })
        .catch((error) => {
          console.log(error);
        });

      // this.opEdocscategory = [
      //   { label: "MBL", value: 1 },
      //   { label: "HBL", value: 2 },
      //   { label: "Vendor Invoice", value: 3 },
      //   { label: "Shipping Bill", value: 4 },
      //   { label: "Others", value: 5 },
      // ];
    },
    async onUpload() {
      if (!this.uploadFile) {
        this.$q.notify({
          message: "select File to upload",
          color: "orange",
          position: "center",
          classes: "warning-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        console.error("No file selected for upload.");
        return;
      }
      // Check if the file size exceeds 20 MB (20 * 1024 * 1024 bytes)
      const maxFileSize = 20 * 1024 * 1024; // 20 MB
      if (this.uploadFile.size > maxFileSize) {
        this.$q.notify({
          message: "File size exceeds the maximum allowed (20 MB).",
          color: "orange",
          position: "center",
          classes: "warning-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        console.error("File size exceeds the maximum allowed (20 MB).");
        return;
      }

      // Check if the file type is allowed (pdf, excel, jpg, png)
      const allowedFileTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
      ];
      if (!allowedFileTypes.includes(this.uploadFile.type)) {
        this.$q.notify({
          message:
            "File type not allowed. Allowed types: pdf, excel, jpg, png.",
          color: "orange",
          position: "center",
          classes: "warning-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
        console.error(
          "File type not allowed. Allowed types: pdf, excel, jpg, png."
        );
        return;
      }
      const formData = new FormData();
      formData.append("file", this.uploadFile);
      formData.append("uploadFolder", "/edocsuploads");

      try {
        const response = await axios.post(
          `${CargoNet_API}/shipments/eDocsUploadserver`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle the response from the server here
        // console.log(response.data);

        if (response.data.success) {
          // Assuming the server returns an object with a 'success' property
          const { uniqueFileName, uploadFolder } = response.data;
          this.addEDocsUploadsserver(
            uniqueFileName,
            uploadFolder,
            this.BranchID, // Pass the BranchID value
            this.CurrentFinYear,
            this.Edocscategory ? this.Edocscategory.value : 0
          );

          // this.$refs.uploader.removeFiles();
          this.$refs.uploader.reset();

          // this.fileAdded = false;
          // this.uploadFile = null;
        } else {
          console.error("File upload failed:", response.data.message);
        }
      } catch (error) {
        // Handle any errors that occur during the upload
        console.error("Error uploading file:", error);
      }
    },
    addEDocsUploadsserver(filename, serverPath, branchId, finyearId, category) {
      let jobId = this.$route.query.selectedRow || this.TempID;
      jobId = jobId ? jobId : this.jobId; // Ensure jobId is defined
      const now = new Date();
      const dateString = now.toISOString().replace(/[-T:.Z]/g, "");
      // const filenameWithDateTime = `${filename}_${dateString}`;
      axios
        .post(`${CargoNet_API}/shipments/${jobId}/eDocsUpload`, {
          TempID: jobId,
          FileName: filename,
          AmazonPath: serverPath,
          EdocsCompID: branchId,
          FinyearID: finyearId,
          Category: category,
        })
        .then((res) => {
          // console.log(res);
          this.UploadMethod();
          this.getEDocsDownlaod();
        })
        .catch((err) => {
          this.$q.notify({
            message: "err",
            color: "negative",
            position: "center",
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
          console.log(err);
        });
    },
    // downloadFileServer(filename) {
    //   // Construct the download URL based on your API endpoint
    //   const downloadUrl = `${CargoNet_API}/shipments/eDocsUploadserver/download/${filename}`;

    //   // Create an anchor element for the download
    //   const anchor = document.createElement("a");
    //   anchor.href = downloadUrl;
    //   anchor.target = "_blank"; // Open the link in a new tab

    //   // Trigger a click event on the anchor to start the download
    //   anchor.click();
    // },
    downloadFileServer(filename) {
      const downloadUrl = `${CargoNet_API}/shipments/eDocsUploadserver/download/${filename}`;
      const token = sessionStorage.getItem("accessToken"); // get JWT token

      if (!token) {
        console.error("No access token found. User might not be logged in.");
        return;
      }

      fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // send token
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok. Status: ${response.status}`
            );
          }
          return response.blob(); // convert response to blob
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename; // use original filename
          document.body.appendChild(a);
          a.click(); // trigger download
          a.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => console.error("Download failed:", error));
    },

    async onUploadAmazon() {
      if (!this.Edocscategory) {
        this.$q.notify({
          message: "Select Categoty then Upload",
          color: "negative",
          position: "center",
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
      } else {
        if (this.fileAdded) {
          let jobId = this.$route.query.selectedRow || this.TempID;
          // if (jobId < 10) {
          //   this.$q.notify({
          //     message: "Please save the job before uploading",
          //     color: "negative",
          //     position: "center",
          //     classes: "text-body24 font-weight-bold q-py-md q-px-lg",
          //     style: "font-size: 240px",
          //   });
          //   return; // stop the upload process
          // }
          try {
            const presignedUrlResponse = await axios.get(
              `${MMT_Internal_API_Amazon}/PresignedURL`,

              {
                params: {
                  filename: this.uploadFile.name,
                },
              }
            );

            // console.log(presignedUrlResponse.data);
            const filename = this.uploadFile.name;
            // Upload file to S3
            const formData = new FormData();
            formData.append("file", this.uploadFile);

            const uploadResponse = await axios.put(
              `${MMT_Internal_API_Amazon}/PutPresignedS3?filename=${filename}`,
              formData
            );
            // console.log(uploadResponse);
            this.addEDocsUploads(
              this.uploadFile.name,
              presignedUrlResponse.data
            );
            this.fileAdded = false;
            this.uploadFile = null;
            this.$refs.uploader.removeFiles();
          } catch (error) {
            console.error(error);
          }
        } else {
          this.$q.notify({
            message: "First select the file",
            color: "negative",
            position: "center",
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
        }
      }
    },

    onFileAdd(file) {
      if (file && file.length > 0 && file[0].name) {
        this.uploadFile = file[0];
        this.fileAdded = true;
      } else {
        console.error("File is missing or does not have a name property");
      }
    },

    addEDocsUploads(filename, amazonPath) {
      let jobId = this.$route.query.selectedRow || this.TempID;
      const now = new Date();
      const dateString = now.toISOString().replace(/[-T:.Z]/g, "");
      const filenameWithDateTime = `${filename}_${dateString}`;
      axios
        .post(`${CargoNet_API}/shipments/${jobId}/eDocsUpload`, {
          TempID: jobId,
          FileName: filename,
          EdocsCompID: this.BranchID,
          AmazonPath: amazonPath,
          FinyearID: this.CurrentFinYear,
          Category: this.Edocscategory ? this.Edocscategory.value : 0,
        })
        .then((res) => {
          // console.log(res);
          this.UploadMethod();
          this.getEDocsDownlaod();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getEDocsDownlaod() {
      let ID = this.$route.query.selectedRow || this.TempID;
      if (!ID) {
        ID = ID ? ID : this.jobId; // Ensure ID is defined
      }
      if (ID !== "") {
        axios
          .get(`${CargoNet_API}/shipments/${ID}/EDocs`)

          .then((res) => {
            this.getuplodfile = res.data;
            this.MBLLabel = res.data.filter((val) => val.Category === 1);
            this.HBLLabel = res.data.filter((val) => val.Category === 2);
            this.VendorInvLabel = res.data.filter((val) => val.Category === 3);
            this.SBLabel = res.data.filter((val) => val.Category === 4);
            this.ODLabel = res.data.filter((val) => val.Category === 5);
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // GetLabel(type) {
    //   if (type === "MBL") {
    //     return this.MBLLabel && this.MBLLabel.length > 0
    //       ? type + " : " + this.MBLLabel.map((file) => file.FileName).join(", ")
    //       : "MBL";
    //   } else if (type === "HBL") {
    //     return this.HBLLabel && this.HBLLabel.length > 0
    //       ? type + " : " + this.HBLLabel.map((file) => file.FileName).join(", ")
    //       : "HBL";
    //   } else if (type === "VendorInv") {
    //     return this.VendorInvLabel && this.VendorInvLabel.length > 0
    //       ? type +
    //           " : " +
    //           this.VendorInvLabel.map((file) => file.FileName).join(", ")
    //       : "Vendor Invoice";
    //   } else if (type === "SB") {
    //     return this.SBLabel && this.SBLabel.length > 0
    //       ? type + " : " + this.SBLabel.map((file) => file.FileName).join(", ")
    //       : "Shipping Bill";
    //   } else if (type === "OD") {
    //     return this.ODLabel && this.ODLabel.length > 0
    //       ? type + " : " + this.ODLabel.map((file) => file.FileName).join(", ")
    //       : "Other Documents";
    //   }
    // },
    // fabstyle(type) {
    //   if (type === "MBL") {
    //     const backgroundColor = this.MBLLabel != "" ? "#009c3c" : "#ff5722";
    //     return { backgroundColor };
    //   } else if (type === "HBL") {
    //     const backgroundColor = this.HBLLabel != "" ? "#009c3c" : "#003036";
    //     return { backgroundColor };
    //   } else if (type === "VendorInv") {
    //     const backgroundColor =
    //       this.VendorInvLabel != "" ? "#009c3c" : "#9100bd";
    //     return { backgroundColor };
    //   } else if (type === "SB") {
    //     const backgroundColor = this.SBLabel != "" ? "#009c3c" : "#6e0034";
    //     return { backgroundColor };
    //   } else if (type === "OD") {
    //     const backgroundColor = this.ODLabel != "" ? "#009c3c" : "#006e68";
    //     return { backgroundColor };
    //   }
    // },
    // fabstyle(type) {
    //   if (type === "MBL") {
    //     const backgroundColor =
    //       this.MBLLabel.length > 0 ? "#009c3c" : "#ffffff";
    //     const border = this.MBLLabel.length > 0 ? "none" : "2px dotted #ff5722";
    //     const color = this.MBLLabel.length > 0 ? "#ffffff" : "#ff5722";
    //     return { backgroundColor, border, color };
    //   } else if (type === "HBL") {
    //     const backgroundColor =
    //       this.HBLLabel.length > 0 ? "#009c3c" : "#ffffff";
    //     const border = this.HBLLabel.length > 0 ? "none" : "2px dotted #003036";
    //     const color = this.HBLLabel.length > 0 ? "#ffffff" : "#003036";
    //     return { backgroundColor, border, color };
    //   } else if (type === "VendorInv") {
    //     const backgroundColor =
    //       this.VendorInvLabel.length > 0 ? "#009c3c" : "#ffffff";
    //     const border =
    //       this.VendorInvLabel.length > 0 ? "none" : "2px dotted #9100bd";
    //     const color = this.VendorInvLabel.length > 0 ? "#ffffff" : "#9100bd";
    //     return { backgroundColor, border, color };
    //   } else if (type === "SB") {
    //     const backgroundColor = this.SBLabel.length > 0 ? "#009c3c" : "#ffffff";
    //     const border = this.SBLabel.length > 0 ? "none" : "2px dotted #6e0034";
    //     const color = this.SBLabel.length > 0 ? "#ffffff" : "#6e0034";
    //     return { backgroundColor, border, color };
    //   } else if (type === "OD") {
    //     const backgroundColor = this.ODLabel.length > 0 ? "#009c3c" : "#ffffff";
    //     const border = this.ODLabel.length > 0 ? "none" : "2px dotted #006e68";
    //     const color = this.ODLabel.length > 0 ? "#ffffff" : "#006e68";
    //     return { backgroundColor, border, color };
    //   }
    // },

    fabstyle(label, index) {
      const config = this.fabConfig?.[index];
      if (!config) return {};

      const files = this.getuplodfile || [];
      const isActive = files.some((item) => item.CategoryName === label);

      return {
        backgroundColor: isActive ? "#009c3c" : "#ffffff",
        border: isActive ? "none" : `2px dotted ${config.color}`,
        color: isActive ? "#ffffff" : config.color,
      };
    },

    onClickFab(type) {
      this.Edocscategory = "";
      this.selectedTab = "eDocs";
      this.Edocscategory = this.opEdocscategory.find(
        (item) => item.label === type
      );
    },
    async createGetPresignedUrl(fileName) {
      try {
        // Make a GET request to the API to generate a presigned URL
        const response = await axios.get(
          //`https://localhost:7091/api/GetPresignedS3?filename=${fileName}`);
          `${MMT_Internal_API_Amazon}/GetPresignedS3?filename=${fileName}`
        );
        const presignedUrl = response.data;

        // Make a GET request to the presigned URL to download the file
        const fileResponse = await axios.get(presignedUrl, {
          responseType: "blob", // Set the response type to blob to download the file
        });

        // Create a link element to trigger download
        const link = document.createElement("a");

        link.href = URL.createObjectURL(fileResponse.data);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        // Remove the temporary link object from the DOM
        document.body.removeChild(link);

        this.$q.notify({
          message: "File downloaded  successfully",
          color: "positive",
          position: "center",
          classes: "positive-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
      } catch (error) {
        this.$q.notify({
          message: "Error downloading file",
          color: "negative",
          position: "center",
          classes: "negative-alert", // swap per type
          actions: [{ icon: "close", round: true, dense: true }],
        });
      }
    },
    UploadMethod() {
      this.$q.notify({
        message: "Uploaded successfully",
        color: "positive",
        position: "center",
        classes: "positive-alert", // swap per type
        actions: [{ icon: "close", round: true, dense: true }],
        timeout: 1000,
      });
    },
  },
};

//Edoc - Deleted lines from the job form
// LoadCategory() {
//   axios
//     .get(
//       `${CargoNet_API}/industrydata/documenttypecategorymapping/${this.FormID}/${this.BranchID}`
//     )

//     .then((response) => {
//       this.opEdocscategory = response.data.map((optioncategory) => ({
//         value: optioncategory.categoryID,
//         label: optioncategory.category,
//       }));
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   // this.opEdocscategory = [
//   //   { label: "MBL", value: 1 },
//   //   { label: "HBL", value: 2 },
//   //   { label: "Vendor Invoice", value: 3 },
//   //   { label: "Shipping Bill", value: 4 },
//   //   { label: "Others", value: 5 },
//   // ];
// },
// async onUpload() {
//
//   if (!this.uploadFile) {
//     this.$q.notify({
//       message: "select File to upload",
//       color: "orange",
//       position: "center",
//       classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//       style: "font-size: 240px",
//     });
//     console.error("No file selected for upload.");
//     return;
//   }
//   // Check if the file size exceeds 20 MB (20 * 1024 * 1024 bytes)
//   const maxFileSize = 20 * 1024 * 1024; // 20 MB
//   if (this.uploadFile.size > maxFileSize) {
//     this.$q.notify({
//       message: "File size exceeds the maximum allowed (20 MB).",
//       color: "orange",
//       position: "center",
//       classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//       style: "font-size: 240px",
//     });
//     console.error("File size exceeds the maximum allowed (20 MB).");
//     return;
//   }

//   // Check if the file type is allowed (pdf, excel, jpg, png)
//   const allowedFileTypes = [
//     "application/pdf",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "image/jpeg",
//     "image/png",
//   ];
//   if (!allowedFileTypes.includes(this.uploadFile.type)) {
//     this.$q.notify({
//       message:
//         "File type not allowed. Allowed types: pdf, excel, jpg, png.",
//       color: "orange",
//       position: "center",
//       classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//       style: "font-size: 240px",
//     });
//     console.error(
//       "File type not allowed. Allowed types: pdf, excel, jpg, png."
//     );
//     return;
//   }
//   const formData = new FormData();
//   formData.append("file", this.uploadFile);
//   formData.append("uploadFolder", "/edocsuploads");

//   try {
//     const response = await axios.post(
//       `${CargoNet_API}/shipments/eDocsUploadserver`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     // Handle the response from the server here
//     console.log(response.data);
//
//     if (response.data.success) {
//       // Assuming the server returns an object with a 'success' property
//       const { uniqueFileName, uploadFolder } = response.data;
//       this.addEDocsUploadsserver(
//         uniqueFileName,
//         uploadFolder,
//         this.BranchID, // Pass the BranchID value
//         this.CurrentFinYear,
//         this.Edocscategory ? this.Edocscategory.value : 0
//       );

//       // this.fileAdded = false;
//       // this.uploadFile = null;
//     } else {
//       console.error("File upload failed:", response.data.message);
//     }
//   } catch (error) {
//     // Handle any errors that occur during the upload
//     console.error("Error uploading file:", error);
//   }
// },
// addEDocsUploadsserver(filename, serverPath, branchId, finyearId, category) {
//
//   let jobId = this.$route.query.selectedRow || this.TempID;
//   const now = new Date();
//   const dateString = now.toISOString().replace(/[-T:.Z]/g, "");
//   // const filenameWithDateTime = `${filename}_${dateString}`;
//   axios
//     .post(`${CargoNet_API}/shipments/${jobId}/eDocsUpload`, {
//       TempID: jobId,
//       FileName: filename,
//       AmazonPath: serverPath,
//       EdocsCompID: branchId,
//       FinyearID: finyearId,
//       Category: category,
//     })
//     .then((res) => {
//       console.log(res);
//       this.UploadMethod();
//       this.getEDocsDownlaod();
//     })
//     .catch((err) => {
//       this.$q.notify({
//         message: "err",
//         color: "negative",
//         position: "center",
//         classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//         style: "font-size: 240px",
//       });
//       console.log(err);
//     });
// },
// downloadFileServer(filename) {
//   // Construct the download URL based on your API endpoint
//   const downloadUrl = `${CargoNet_API}/shipments/eDocsUploadserver/download/${filename}`;

//   // Create an anchor element for the download
//   const anchor = document.createElement("a");
//   anchor.href = downloadUrl;
//   anchor.target = "_blank"; // Open the link in a new tab

//   // Trigger a click event on the anchor to start the download
//   anchor.click();
// },
// async onUploadAmazon() {
//   if (!this.Edocscategory) {
//     this.$q.notify({
//       message: "Select Categoty then Upload",
//       color: "negative",
//       position: "center",
//       classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//       style: "font-size: 240px",
//     });
//   } else {
//     if (this.fileAdded) {
//       let jobId = this.$route.query.selectedRow || this.TempID;
//       // if (jobId < 10) {
//       //   this.$q.notify({
//       //     message: "Please save the job before uploading",
//       //     color: "negative",
//       //     position: "center",
//       //     classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//       //     style: "font-size: 240px",
//       //   });
//       //   return; // stop the upload process
//       // }
//       try {
//         const presignedUrlResponse = await axios.get(
//           `${MMT_Internal_API_Amazon}/PresignedURL`,

//           {
//             params: {
//               filename: this.uploadFile.name,
//             },
//           }
//         );

//         console.log(presignedUrlResponse.data);
//         const filename = this.uploadFile.name;
//         // Upload file to S3
//         const formData = new FormData();
//         formData.append("file", this.uploadFile);

//         const uploadResponse = await axios.put(
//           `${MMT_Internal_API_Amazon}/PutPresignedS3?filename=${filename}`,
//           formData
//         );
//         console.log(uploadResponse);
//         this.addEDocsUploads(
//           this.uploadFile.name,
//           presignedUrlResponse.data
//         );
//         this.fileAdded = false;
//         this.uploadFile = null;
//         this.$refs.uploader.removeFiles();
//       } catch (error) {
//         console.error(error);
//       }
//     } else {
//       this.$q.notify({
//         message: "First select the file",
//         color: "negative",
//         position: "center",
//         classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//         style: "font-size: 240px",
//       });
//     }
//   }
// },

// onFileAdd(file) {
//
//   if (file && file.length > 0 && file[0].name) {
//     this.uploadFile = file[0];
//     this.fileAdded = true;
//   } else {
//     console.error("File is missing or does not have a name property");
//   }
// },

// addEDocsUploads(filename, amazonPath) {
//   let jobId = this.$route.query.selectedRow || this.TempID;
//   const now = new Date();
//   const dateString = now.toISOString().replace(/[-T:.Z]/g, "");
//   const filenameWithDateTime = `${filename}_${dateString}`;
//   axios
//     .post(`${CargoNet_API}/shipments/${jobId}/eDocsUpload`, {
//       TempID: jobId,
//       FileName: filename,
//       EdocsCompID: this.BranchID,
//       AmazonPath: amazonPath,
//       FinyearID: this.CurrentFinYear,
//       Category: this.Edocscategory ? this.Edocscategory.value : 0,
//     })
//     .then((res) => {
//       console.log(res);
//       this.UploadMethod();
//       this.getEDocsDownlaod();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// },
// getEDocsDownlaod() {
//
//   let ID = this.$route.query.selectedRow || this.TempID;
//   if (ID !== "") {
//     axios
//       .get(`${CargoNet_API}/shipments/${ID}/EDocs`)

//       .then((res) => {
//         this.getuplodfile = res.data;
//         this.MBLLabel = res.data.filter((val) => val.Category === 1);
//         this.HBLLabel = res.data.filter((val) => val.Category === 2);
//         this.VendorInvLabel = res.data.filter((val) => val.Category === 3);
//         this.SBLabel = res.data.filter((val) => val.Category === 4);
//         this.ODLabel = res.data.filter((val) => val.Category === 5);
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// },
// GetLabel(type) {
//   if (type === "MBL") {
//     return this.MBLLabel && this.MBLLabel.length > 0
//       ? type + " : " + this.MBLLabel.map((file) => file.FileName).join(", ")
//       : "MBL";
//   } else if (type === "HBL") {
//     return this.HBLLabel && this.HBLLabel.length > 0
//       ? type + " : " + this.HBLLabel.map((file) => file.FileName).join(", ")
//       : "HBL";
//   } else if (type === "VendorInv") {
//     return this.VendorInvLabel && this.VendorInvLabel.length > 0
//       ? type +
//           " : " +
//           this.VendorInvLabel.map((file) => file.FileName).join(", ")
//       : "Vendor Invoice";
//   } else if (type === "SB") {
//     return this.SBLabel && this.SBLabel.length > 0
//       ? type + " : " + this.SBLabel.map((file) => file.FileName).join(", ")
//       : "Shipping Bill";
//   } else if (type === "OD") {
//     return this.ODLabel && this.ODLabel.length > 0
//       ? type + " : " + this.ODLabel.map((file) => file.FileName).join(", ")
//       : "Other Documents";
//   }
// },
// // fabstyle(type) {
// //   if (type === "MBL") {
// //     const backgroundColor = this.MBLLabel != "" ? "#009c3c" : "#ff5722";
// //     return { backgroundColor };
// //   } else if (type === "HBL") {
// //     const backgroundColor = this.HBLLabel != "" ? "#009c3c" : "#003036";
// //     return { backgroundColor };
// //   } else if (type === "VendorInv") {
// //     const backgroundColor =
// //       this.VendorInvLabel != "" ? "#009c3c" : "#9100bd";
// //     return { backgroundColor };
// //   } else if (type === "SB") {
// //     const backgroundColor = this.SBLabel != "" ? "#009c3c" : "#6e0034";
// //     return { backgroundColor };
// //   } else if (type === "OD") {
// //     const backgroundColor = this.ODLabel != "" ? "#009c3c" : "#006e68";
// //     return { backgroundColor };
// //   }
// // },
// fabstyle(type) {
//
//   if (type === "MBL") {
//     const backgroundColor =
//       this.MBLLabel.length > 0 ? "#009c3c" : "#ffffff";
//     const border = this.MBLLabel.length > 0 ? "none" : "2px dotted #ff5722";
//     const color = this.MBLLabel.length > 0 ? "#ffffff" : "#ff5722";
//     return { backgroundColor, border, color };
//   } else if (type === "HBL") {
//     const backgroundColor =
//       this.HBLLabel.length > 0 ? "#009c3c" : "#ffffff";
//     const border = this.HBLLabel.length > 0 ? "none" : "2px dotted #003036";
//     const color = this.HBLLabel.length > 0 ? "#ffffff" : "#003036";
//     return { backgroundColor, border, color };
//   } else if (type === "VendorInv") {
//     const backgroundColor =
//       this.VendorInvLabel.length > 0 ? "#009c3c" : "#ffffff";
//     const border =
//       this.VendorInvLabel.length > 0 ? "none" : "2px dotted #9100bd";
//     const color = this.VendorInvLabel.length > 0 ? "#ffffff" : "#9100bd";
//     return { backgroundColor, border, color };
//   } else if (type === "SB") {
//     const backgroundColor = this.SBLabel.length > 0 ? "#009c3c" : "#ffffff";
//     const border = this.SBLabel.length > 0 ? "none" : "2px dotted #6e0034";
//     const color = this.SBLabel.length > 0 ? "#ffffff" : "#6e0034";
//     return { backgroundColor, border, color };
//   } else if (type === "OD") {
//     const backgroundColor = this.ODLabel.length > 0 ? "#009c3c" : "#ffffff";
//     const border = this.ODLabel.length > 0 ? "none" : "2px dotted #006e68";
//     const color = this.ODLabel.length > 0 ? "#ffffff" : "#006e68";
//     return { backgroundColor, border, color };
//   }
// },
// onClickFab(type) {
//   this.Edocscategory = "";
//   this.selectedTab = "EDocs";
//   this.Edocscategory = this.opEdocscategory.find(
//     (item) => item.label === type
//   );
// },
// async createGetPresignedUrl(fileName) {
//   try {
//     // Make a GET request to the API to generate a presigned URL
//     const response = await axios.get(
//       //`https://localhost:7091/api/GetPresignedS3?filename=${fileName}`);
//       `${MMT_Internal_API_Amazon}/GetPresignedS3?filename=${fileName}`
//     );
//     const presignedUrl = response.data;

//     // Make a GET request to the presigned URL to download the file
//     const fileResponse = await axios.get(presignedUrl, {
//       responseType: "blob", // Set the response type to blob to download the file
//     });

//     // Create a link element to trigger download
//     const link = document.createElement("a");

//     link.href = URL.createObjectURL(fileResponse.data);
//     link.setAttribute("download", fileName);
//     document.body.appendChild(link);
//     link.click();

//     // Remove the temporary link object from the DOM
//     document.body.removeChild(link);

//     this.$q.notify({
//       message: "File downloaded  successfully",
//       color: "positive",
//       position: "center",
//       classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//       style: "font-size: 240px",
//     });
//   } catch (error) {
//     this.$q.notify({
//       message: "Error downloading file",
//       color: "negative",
//       position: "center",
//       classes: "text-body24 font-weight-bold q-py-md q-px-lg",
//       style: "font-size: 240px",
//     });
//   }
// },

//Job Actions
// ExportPdf() {
//   let jobId = this.$route.query.selectedRow || this.TempID;
//   axios
//     .get(
//       `${Reports_API}/FrmReportCR.asmx/Reports?docid=${this.FormID}&id=${jobId}`,
//       {
//         responseType: "blob",
//       }
//     )
//     .then((response) => {
//       // Create a blob object from the response data
//       const blob = new Blob([response.data], { type: "application/pdf" });

//       // Create a temporary URL for the blob object
//       const url = window.URL.createObjectURL(blob);

//       // Create a link element and set its attributes
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "Export.pdf";

//       // Append the link element to the document body
//       document.body.appendChild(link);

//       // Simulate a click event on the link to trigger the download
//       link.click();

//       // Clean up the temporary URL and remove the link element
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(link);
//     })
//     .catch((error) => {
//       // Handle the error here
//       console.error(error);
//     });
// },
