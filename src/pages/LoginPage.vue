<template><div class="hide-overflow">
    <div v-if="loading" class="loader-container">
      <span class="loader"></span>
      <!-- <span class="loader_txt_P"
        >Loading your data securely. This will only take a moment.</span
      > -->
    </div>
    <div v-else>
      <q-page id="login-page">
        <div class="overlay"></div>
        <div class="particle-network" ref="particleNetwork"></div>

        <div class="login-container">
          <q-card class="login-box q-pa-lg">
            <q-card-section class="text-center">
              <h1>Welcome To</h1>
              <img :src="logoSrc" alt="AI Logo" class="logo" />
            </q-card-section>

            <q-form
              method="post"
              id="loginForm"
              autocomplete="off"
              novalidate="novalidate"
              @submit="login"
            >
              <q-input bg-color="blue-1"
                outlined
                class="login-field"
                v-model="email"
                label="Username"
                :rules="[(v) => !!v || 'Username is required']"
              >
                <template #prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input bg-color="blue-1"
                outlined
                class="login-field"
                v-model.trim="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :rules="[
                  (v) =>
                    (v && v.length >= 6) || 'Password must be atleast 6 chars',
                ]"
              >
                <template #prepend>
                  <q-icon name="lock" />
                </template>
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="password-toggle"
                    role="button"
                    tabindex="0"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                    @keydown.enter.prevent="showPassword = !showPassword"
                    @keydown.space.prevent="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-btn
                type="submit"
                label="LOGIN"
                class="btn-login"
                unelevated
              />

              <div class="footer-links">
                <a href="#">Forgot password?</a>
              </div>
            </q-form>

            <div class="separate" />

            <div class="feature-content q-mt-md">
              <p>
                New Features : CargoNet Real time Cargo Tracking is easy to use
                online cargo tracking application that integrates seamlessly
                with the website to give real time status information.
              </p>

              <div class="social-login-section">
                <div class="social-buttons row justify-center q-gutter-sm">
                  <q-btn
                    flat
                    round
                    @click="handleSocialLogin('cargonet')"
                    class="social-btn"
                  >
                    <img
                      :src="cargonetIconSrc"
                      alt="CargoNet"
                      class="social-icon"
                    />
                  </q-btn>
                  <q-btn
                    flat
                    round
                    @click="handleSocialLogin('facebook')"
                    class="social-btn"
                  >
                    <img
                      :src="facebookIconSrc"
                      alt="Facebook"
                      class="social-icon"
                    />
                  </q-btn>
                  <q-btn
                    flat
                    round
                    @click="handleSocialLogin('twitter')"
                    class="social-btn"
                  >
                    <img
                      :src="twitterIconSrc"
                      alt="Twitter"
                      class="social-icon"
                    />
                  </q-btn>
                  <q-btn
                    flat
                    round
                    @click="handleSocialLogin('linkedin')"
                    class="social-btn"
                  >
                    <img
                      :src="linkedinIconSrc"
                      alt="LinkedIn"
                      class="social-icon"
                    />
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </q-page>
    </div>
  </div></template>

<script>
import axios from "axios";
import Login_API from "/src/IPConfig/configLogin.js";
import { LoaderMixin } from "src/mixins/Loadermixin.js";
import CustomLoader from "src/pages/loader.vue";
import {
  MOCK_LOGIN_MODE,
  buildMockLoginResponse,
} from "src/IPConfig/mockLogin.js";

export default {
  mixins: [LoaderMixin],
  data() {
    return {
      loading: false,
      email: "",
      password: "",
      showPassword: false,
      showAlert: false,
      statuscount: 0,
      UserLocked: false,
      wrongcount: 0,
      ip: "",
      Userblocked: false,
      sessionId: "",
      Loginid: 0,
      uniqueid: 0,
      Logoutstatus: false,
      Logstatus: "",
      Activecount: [],
      Loginerrorstatus: false,
      Loginerroralert: "",
    };
  },
  created() {
    this.sessionId = window.sessionStorage.getItem("accessToken");
    this.uniqueid = window.sessionStorage.getItem("uniqueid");

    if (window.location.hash === "#/Logout=Y") {
      this.Logoutstatus = true;
      // this.Updateloginstatus();
    } else {
      this.Logoutstatus = false;
    }
    if (!this.uniqueid) {
      this.generateRandomString();
    }
    this.getIpAddress();
    if (window.location.hash === "#/AutoWtsAppMsg") {
      this.login();
      sessionStorage.setItem("AutoWtsAppMsg", "Y");
    } else {
      sessionStorage.setItem("AutoWtsAppMsg", "N");
    }
  },
  mounted() {
    window.addEventListener("app:backbutton", this.handleHardwareBack);
  },
  beforeUnmount() {
    window.removeEventListener("app:backbutton", this.handleHardwareBack);
  },
  computed: {
    isRequired() {
      return (val) => {
        if (!val.trim()) {
          this.showAlert = true;
          return "Field is mandatory";
        }
        return true;
      };
    },
    isValidLogin() {
      return this.email.trim() && this.password.trim();
    },
  },
  methods: {
    // Hardware back button (Android APK) on the login/root screen. There's
    // no in-app history to go back to here, so mirror standard Android
    // behavior (and the dashboard's own back-button prompt): confirm, then
    // exit the app, instead of silently doing nothing.
    handleHardwareBack() {
      this.$q
        .dialog({
          title: "Exit App",
          message: "Do you want to exit the application?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          if (window.navigator && navigator.app && navigator.app.exitApp) {
            navigator.app.exitApp();
          }
        });
    },
    async login() {
      this.GetUserStatus();
      this.Getloginstatus();
      if (this.isValidLogin && window.location.hash !== "#/AutoWtsAppMsg") {
        try {
          this.loading = true; // Show the loading spinner

          const response = MOCK_LOGIN_MODE
            ? { data: buildMockLoginResponse(this.email) }
            : await axios.post(`${Login_API}/Login/Login/`, {
                email: this.email,
                password: this.password,
              });

          if (response.data && response.data.id !== 0) {
            const APIUserID = response.data.id;
            const APIEmail = response.data.userName;

            const APIUserType = response.data.userType;
            const APIAccessCode = response.data.accessCode; // Retrieve the AccessCode
            const APIExpiresAt = response.data.expires;

            if (this.statuscount === 0) {
              // if (APIEmail === this.email && APIPassword === this.password) {
              // if (
              //   this.Loginid.toString() === this.uniqueid ||
              //   this.email === "icodeadmin" ||
              //   this.email === "demo" ||
              //   this.Logstatus === "false"
              // ) {
              const expirationTime = new Date(APIExpiresAt).getTime();
              sessionStorage.setItem("APIUserID", APIUserID);
              sessionStorage.setItem("APIEmail", APIEmail);
              sessionStorage.setItem("APIUserType", APIUserType);
              sessionStorage.setItem("accessToken", APIAccessCode);
              sessionStorage.setItem("tokenExpiration", expirationTime);
              this.$router.push({ path: "/IndexPage" });
              const currentTime = new Date().getTime();
              const timeUntilExpiration = expirationTime - currentTime;
              if (
                this.Loginid.toString() === this.uniqueid ||
                this.email !== "icodeadmin" ||
                this.email !== "demo"
              ) {
                this.Updateloginstatus();
              }
              this.InsertClientLogin();

              if (timeUntilExpiration > 0) {
                setTimeout(() => {
                  // Token has expired, stop all processes
                  // console.log(APIAccessCode, "Token has expired");
                  this.$router.replace({ path: "/" });
                  // Additional code to stop processes goes here
                }, timeUntilExpiration);
              }
              // } else {
              //   this.$q.notify({
              //     message: "You have been logged into somewhere else..",
              //     color: "negative",
              //     position: "center",
              //   });
              // }
              // } else {
              //   this.$q.notify({
              //     message: "Invalid UserName or Password",
              //     color: "negative",
              //     position: "center",
              //   });
              //   if (this.wrongcount < 2) {
              //     this.wrongcount++;
              //   } else {
              //     this.Updateuserstatus();
              //     this.Userblocked = true;
              //   }
              // }
            } else {
              this.UserLocked = true;
            }
          } else {
            this.$q.notify({
              message: response.data.message || "Invalid UserName or Password",
              color: "negative",
              position: "center",
              timeout: 5000,
              classes: "negative-alert", // swap per type
              actions: [{ icon: "close", round: true, dense: true }],
            });
          }
          // else {
          //   this.$q.notify({
          //     message: "Invalid UserName or Password",
          //     color: "negative",
          //     position: "center",
          //   });
          // }
        } catch (error) {
          this.$q.notify({
            message: "Invalid UserName or Password",
            color: "negative",
            position: "center",
            timeout: 5000,
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
        } finally {
          this.loading = false; // Hide the loading spinner
        }
      } else if (
        !this.isValidLogin &&
        window.location.hash === "#/AutoWtsAppMsg"
      ) {
        try {
          this.loading = true; // Show the loading spinner

          const response = await axios.get(
            `${Login_API}/Login/` + "ICTQRAdmin"
          );

          if (response.data && response.data.length > 0) {
            const APIUserID = response.data[0].id;
            const APIEmail = response.data[0].userName;
            const APIPassword = response.data[0].password;
            const APIAccessCode = response.data[0].accessCode; // Retrieve the AccessCode
            const APIExpiresAt = response.data[0].expires;

            // console.log(APIEmail, APIPassword, APIAccessCode);

            // if (
            //   this.Loginid.toString() === this.uniqueid ||
            //   this.email === "icodeadmin" ||
            //   this.email === "demo" ||
            //   this.Logstatus === "false"
            // ) {
            const expirationTime = new Date(APIExpiresAt).getTime();
            sessionStorage.setItem("APIUserID", APIUserID);
            sessionStorage.setItem("APIEmail", APIEmail);
            sessionStorage.setItem("accessToken", APIAccessCode);
            sessionStorage.setItem("tokenExpiration", expirationTime);
            this.$router.push({ path: "/IndexPage" });
            const currentTime = new Date().getTime();
            const timeUntilExpiration = expirationTime - currentTime;
            if (
              this.Loginid.toString() === this.uniqueid ||
              this.email !== "icodeadmin" ||
              this.email !== "demo"
            ) {
              this.Updateloginstatus();
            }
            this.InsertClientLogin();

            if (timeUntilExpiration > 0) {
              setTimeout(() => {
                // Token has expired, stop all processes
                // console.log(APIAccessCode, "Token has expired");
                this.$router.replace({ path: "/" });
                // Additional code to stop processes goes here
              }, timeUntilExpiration);
            }
            // } else {
            //   this.$q.notify({
            //     message: "You have been logged into somewhere else..",
            //     color: "negative",
            //     position: "center",
            //   });
            // }
          }
        } catch (error) {
          this.$q.notify({
            message: "Invalid UserName or Password",
            color: "negative",
            position: "top",
            timeout: 5000,
            classes: "negative-alert", // swap per type
            actions: [{ icon: "close", round: true, dense: true }],
          });
          console.error(error);
        } finally {
          this.loading = false; // Hide the loading spinner
        }
      } else {
        this.showAlert = true; // Display the alert
      }
    },
    GetUserStatus() {
      if (MOCK_LOGIN_MODE) return;
      axios
        .get(`${Login_API}/Login/${this.email}/userstatus`)
        .then((res) => {
          this.statuscount = res.data[0].Usercount;
          this.Activecount = res.data[0];
          // console.log(this.statuscount);

          if (this.Activecount.length === 0) {
            this.GetUserStatus();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getIpAddress() {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        this.ip = data.ip;
      } catch (error) {
        console.error("Error fetching IP address:", error);
        return null;
      }
    },
    Updateuserstatus() {
      if (MOCK_LOGIN_MODE) return;
      return axios
        .put(`${Login_API}/Login/updateuserstatus`, {
          userid: this.email,
          IPAddress: this.ip,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    generateRandomString() {
      this.uniqueid = Math.floor(100 + Math.random() * 900).toString();
      sessionStorage.setItem("uniqueid", this.uniqueid);
      // console.log("Random string stored in sessionStorage:", this.uniqueid);
    },
    Updateloginstatus() {
      if (MOCK_LOGIN_MODE) return;
      // this.sessionId = window.sessionStorage.getItem("accessToken");
      if (
        this.sessionId !== undefined ||
        this.sessionId !== "" ||
        this.sessionId !== null
      ) {
        return axios
          .put(`${Login_API}/Login/updateloginstatus`, {
            User: this.email ? this.email : sessionStorage.getItem("APIEmail"),
            Sessionid: this.sessionId ? this.sessionId : "",
            // Loginstatus: this.Logoutstatus ? "false" : "true",
            // Uniqueid: this.Logoutstatus ? "0" : this.uniqueid,
            Loginstatus: "true",
            Uniqueid: this.uniqueid,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    },
    async Getloginstatus() {
      if (MOCK_LOGIN_MODE) return;
      await axios
        .get(`${Login_API}/Login/${this.email}/getloginstatus`)
        .then((res) => {
          this.Loginid = res.data[0].Logid;
          this.Logstatus = res.data[0].LogStatus;
          // console.log(this.Loginid);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    InsertClientLogin() {
      if (MOCK_LOGIN_MODE) return;
      axios
        .post(`${Login_API}/Login/insertclientlogin`, {
          User: this.email ? this.email : sessionStorage.getItem("APIEmail"),
          Ipaddress: this.ip,
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const particleNetwork = ref(null);
const logoSrc = require("../images/cargonet-logo.gif");
const cargonetIconSrc = require("../images/cargonet.png");
const facebookIconSrc = require("../images/facebook.png");
const twitterIconSrc = require("../images/twitter.png");
const linkedinIconSrc = require("../images/linkedin.png");

// --- PARTICLE / ICON NETWORK ---
let animationFrame = null;
let resizeObserver = null;

onMounted(() => {
  initParticleNetwork();
});

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (resizeObserver) resizeObserver.disconnect();
});

function initParticleNetwork() {
  const container = particleNetwork.value;
  if (!container) return;

  // bring a full-screen canvas for bg particles
  const bgCanvas = document.createElement("canvas");
  bgCanvas.style.position = "absolute";
  bgCanvas.style.top = "0";
  bgCanvas.style.left = "0";
  bgCanvas.style.width = "100%";
  bgCanvas.style.height = "100%";
  bgCanvas.style.zIndex = "0";
  container.appendChild(bgCanvas);
  const ctx = bgCanvas.getContext("2d");

  // ICONS - use your assets folder. Put desired icons in src/assets/ai-logos/
  const aiIcons = [
    require("../images/ai-logo/chatgpt.png"),
    require("../images/ai-logo/deepseek.png"),
    require("../images/ai-logo/gemini.png"),
    require("../images/ai-logo/apple.png"),
    require("../images/ai-logo/pilot.png"),
    require("../images/ai-logo/meta.png"),
    require("../images/ai-logo/perplexity.png"),
    require("../images/ai-logo/claude.png"),
    require("../images/ai-logo/siri.png"),
    require("../images/ai-logo/chatgpt.png"),
    require("../images/ai-logo/deepseek.png"),
    require("../images/ai-logo/gemini.png"),
    require("../images/ai-logo/apple.png"),
    require("../images/ai-logo/pilot.png"),
  ];

  // Particle icon elements
  const iconParticles = [];
  const connections = [];

  // background particles
  let bgParticles = [];

  // size range (px)
  const maxSize = 80;
  const minSize = 48;

  function randBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  // The login card sits centered over this whole background — normalized
  // (x, y) here is 0..1 across the full page, so a plain Math.random()
  // regularly placed these decorative icons directly behind/under the
  // card, where the card's z-index hides most of an icon but not all of
  // it (it only clips at the card's actual rectangle, not the icon's own
  // circular bounds), leaving that half-cut "poking out from behind the
  // card" look. Re-roll any position that would land in the card's
  // (roughly) centered area instead of just letting it happen.
  function randomPositionOutsideCard() {
    const cardXMin = 0.22;
    const cardXMax = 0.78;
    const cardYMin = 0.06;
    const cardYMax = 0.94;
    let x;
    let y;
    do {
      x = Math.random() * 0.9;
      y = Math.random() * 0.9;
    } while (x > cardXMin && x < cardXMax && y > cardYMin && y < cardYMax);
    return { x, y };
  }

  // create icon divs
  const particleCount = Math.min(aiIcons.length, 12);

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement("div");
    el.className = "particle";

    const size = Math.round(randBetween(minSize, maxSize));
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.position = "absolute";
    el.style.transform = "translate(-50%, -50%)";
    el.style.zIndex = "1";

    const img = document.createElement("img");
    img.src = aiIcons[i % aiIcons.length];
    img.style.width = `${Math.round(size * 0.72)}px`;
    img.style.height = `${Math.round(size * 0.72)}px`;
    img.style.objectFit = "contain";
    img.style.opacity = "0.7";
    img.style.filter = "saturate(0.8)";
    img.draggable = false;

    el.appendChild(img);
    container.appendChild(el);

    const startPos = randomPositionOutsideCard();
    iconParticles.push({
      element: el,
      x: startPos.x, // normalized (0..1)
      y: startPos.y,
      size,
      vx: randBetween(-0.001, 0.001),
      vy: randBetween(-0.001, 0.001),
    });

    // hover effects
    el.addEventListener("mouseenter", () => {
      el.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
      el.style.transform = "translate(-50%, -50%) scale(1.25)";
      el.style.zIndex = "10";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(-50%, -50%) scale(1)";
      el.style.zIndex = "1";
    });
  }

  function createConnections(w, h) {
    // remove old
    connections.forEach((c) => {
      if (c.el && c.el.parentNode) c.el.parentNode.removeChild(c.el);
    });
    connections.length = 0;

    for (let i = 0; i < iconParticles.length; i++) {
      for (let j = i + 1; j < iconParticles.length; j++) {
        const p1 = iconParticles[i];
        const p2 = iconParticles[j];
        const dx = (p2.x - p1.x) * w;
        const dy = (p2.y - p1.y) * h;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < Math.min(w, h) * 0.28) {
          // bigger connection range
          const conn = document.createElement("div");
          conn.className = "particle-connection";
          conn.style.position = "absolute";
          conn.style.height = "1px";
          conn.style.background =
            "linear-gradient(to right, rgba(100,220,255,0.35), rgba(100,220,255,0.12))";
          conn.style.zIndex = "2"; // make sure visible above canvas

          const x1 = p1.x * w;
          const y1 = p1.y * h;
          const x2 = p2.x * w;
          const y2 = p2.y * h;
          const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
          const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

          conn.style.width = `${length}px`;
          conn.style.left = `${x1}px`;
          conn.style.top = `${y1}px`;
          conn.style.transform = `rotate(${angle}deg)`;
          conn.style.opacity = `${1 - dist / (Math.min(w, h) * 0.18)}`;
          conn.style.zIndex = "2";

          container.appendChild(conn);
          connections.push({ el: conn });
        }
      }
    }
  }

  function initBgParticles(w, h) {
    bgParticles = [];
    const count = Math.round(Math.max(30, Math.min(80, (w * h) / 40000)));
    for (let i = 0; i < count; i++) {
      bgParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.5,
        vx: randBetween(-0.4, 0.4),
        vy: randBetween(-0.4, 0.4),
      });
    }
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    bgCanvas.width = rect.width;
    bgCanvas.height = rect.height;

    // reposition iconParticles to stay inside
    iconParticles.forEach((p) => {
      p.x = Math.min(0.98, Math.max(0.02, p.x));
      p.y = Math.min(0.98, Math.max(0.02, p.y));
    });

    initBgParticles(rect.width, rect.height);
    createConnections(rect.width, rect.height);
  }

  // animation
  function animate() {
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // update icon particles
    iconParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // bounce
      if (p.x < 0.02 || p.x > 0.98) p.vx *= -1;
      if (p.y < 0.02 || p.y > 0.98) p.vy *= -1;

      p.element.style.left = `${p.x * w}px`;
      p.element.style.top = `${p.y * h}px`;
    });

    // recreate connections (cheap for small counts)
    createConnections(w, h);

    // background canvas
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(74,108,247,0.45)";

    for (let i = 0; i < bgParticles.length; i++) {
      const p = bgParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 2 || p.x > w - 2) p.vx *= -1;
      if (p.y < 2 || p.y > h - 2) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < bgParticles.length; j++) {
        const p2 = bgParticles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.strokeStyle = `rgba(74,108,247, ${1 - dist / 100})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    animationFrame = requestAnimationFrame(animate);
  }

  // start
  resize();
  animate();

  // responsive
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  // window resize fallback
  window.addEventListener("resize", resize);
}
</script>

<style>
#q-app .particle-network {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
#q-app .particle-network .particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(100, 220, 255, 0.3);
  border: 1px solid rgba(100, 220, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 5px;
  font-size: 24px;
  box-shadow: 0 0 20px rgba(100, 220, 255, 0.3);
  z-index: 1;
  transition: all 0.3s ease;
  cursor: pointer;
  pointer-events: auto;
  opacity: 0.5;
}
#q-app .particle-network .particle img {
  pointer-events: none;
  padding: 3px;
}
#q-app .particle-network .particle-connection {
  position: absolute;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(100, 220, 255, 0.3),
    rgba(100, 220, 255, 0.1)
  );
  transform-origin: left center;
}

#login-page .login-container .q-field--outlined .q-field__control:before {
  border: 0 !important;
}

#login-page .login-container .q-field--outlined .q-field__control:after {
  height: inherit;
  border-radius: inherit;
  border: 1px solid #3faeff;
  transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
}

#login-page .login-container .q-field--outlined .q-field__control {
  border-radius: 8px;
  padding: 0 12px;
  height: 48px;
  border: 0px !important;
  background: #e8f0fe !important;
}
#login-page .login-container .q-field__marginal {
  color: #5ac3ff !important;
}
#login-page .login-container .q-field__marginal i {
  color: #5ac3ff !important;
}
#login-page .login-container .q-field--outlined .q-field__control:after {
  border: 1px solid #5ac3ff;
}
/* The browser's OWN native autofill styling follows color-scheme — that's
   the browser's UI chrome, not something a plain background-color rule
   can touch, so it needs the box-shadow-inset trick (the only reliable
   cross-browser way to override an autofilled field's background). This
   page is always the light design now (MainLayout2 has its own dedicated
   LoginPageMl2.vue), so it's pinned to light regardless of any leftover
   data-theme="ml2" attribute stuck on <html>. */
#login-page {
  color-scheme: light;
}
#login-page .login-container input:-webkit-autofill,
#login-page .login-container input:-webkit-autofill:hover,
#login-page .login-container input:-webkit-autofill:focus {
  -webkit-box-shadow: none !important;
  -webkit-text-fill-color: #1f2937 !important;
  caret-color: #1f2937 !important;
}
#login-page input:-internal-autofill-selected {
  background-color: transparent !important;
  color: #1f2937 !important;
  caret-color: #1f2937 !important;
}

#login-page .login-container .q-field__bottom {
  font-size: 11px;
  padding: 3px 12px 0;
}

#login-page
  .login-container
  .q-field--outlined
  .q-field__control
  .q-field__label {
  left: 0;
  top: 14px;
  letter-spacing: 0.8px !important;
  font-size: 15px;
  color: #0a74db;
}
#login-page .login-container .q-field__marginal {
  height: 48px;
  color: rgba(0, 0, 0, 0.54);
  font-size: 25px;
}

#login-page .login-container .q-field__marginal i {
  font-size: 18px;
  border-radius: 50%;
}

#login-page
  .login-container
  .q-field--outlined
  .q-field__control
  .field__label {
  letter-spacing: 0.8px;
}

@media (min-width: 1200px) and (max-width: 1499px) {
  #login-page .login-container .q-field--outlined .q-field__control {
    border-radius: 4px;
    padding: 0 12px;
    height: 46px;
  }

  #login-page .login-container .ellipsis {
    top: 14px;
    font-size: 14px;
    letter-spacing: 0.8px;
  }

  #login-page .login-container .q-field__native,
  .q-field__input {
    font-size: 14px;
  }

  #login-page .login-container .q-field__marginal {
    height: 46px;
    color: rgba(0, 0, 0, 0.54);
    font-size: 25px;
  }

  #login-page .login-container .q-field__marginal i {
    font-size: 21px;
  }

  #login-page .login-container .q-field--error .q-field__bottom {
    color: var(--q-negative);
    padding-top: 1px;
    letter-spacing: 0.7px;
    display: none;
  }
  #login-page .login-container .q-btn.q-btn-item.btn-login {
    padding: 8px;
    font-size: 14px;
    border-radius: 5px;
  }
}
</style>

<style scoped>
* {
  box-sizing: border-box;
}
body {
  font-family: "Jost", sans-serif !important;
}
#login-page {
  height: 100vh;
  overflow: hidden;
  background-image: url("../images/logistics-ai-background-15.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  font-family: "Jost", sans-serif !important;
  color: white;
}
#login-page .overlay {
  background: linear-gradient(180deg, #000757, #000e6f, #002195);
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.12;
  z-index: 0;
}

#login-page .login-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
#login-page .q-card.login-box {
  scale: 1;
  background: rgb(255 255 255 / 91%);
  backdrop-filter: blur(15px);
  padding: 35px 40px;
  border-radius: 20px;
  width: 450px;
  max-width: 90%;
  text-align: center;
  border: 0 !important;
  /* Was an 8s pulsing animation between a subtle glow and a much stronger
     one that reads like a distinct blue border/frame — same design, but
     it visually looked different depending on which moment of the cycle
     you happened to see it at. Fixed to the subtler, constant version so
     it looks the same every time instead of animating. */
  box-shadow: 0 0 10px rgba(100, 220, 255, 0.3),
    0 0 20px rgba(100, 220, 255, 0.2), 0 0 30px rgba(100, 220, 255, 0.1) !important;
}
/* This page is now always the light design — MainLayout2 gets its own
   dedicated dark-glass component (LoginPageMl2.vue) instead of a
   data-theme="ml2" conditional variant living in here. */
@keyframes glow {
  0% {
    box-shadow: 0 0 10px rgba(100, 220, 255, 0.3),
      0 0 20px rgba(100, 220, 255, 0.2), 0 0 30px rgba(100, 220, 255, 0.1);
  }
  100% {
    box-shadow: 0 0 20px rgba(100, 220, 255, 0.4),
      0 0 40px rgba(100, 220, 255, 0.3), 0 0 60px rgba(100, 220, 255, 0.2);
  }
}

/* Compact by default — no reserved gap while a field has no error showing. */
#login-page .q-field--with-bottom {
  padding-bottom: 0px !important;
}
/* But the (absolutely positioned) error row needs room precisely when it's
   actually showing, or it overlaps whatever sits right after the field —
   "Username is required" / "Password must be atleast 6 chars" overlapping
   the next field/the LOGIN button. .q-field--error is only present while
   an error is active, so this only kicks in exactly when needed and the
   layout stays compact the rest of the time. Placed after the rule above
   so it wins the tie when both classes are on the same element (same
   specificity, so source order decides). */
#login-page .q-field--error {
  padding-bottom: 20px !important;
}

#login-page .q-card.login-box h1 {
  margin-bottom: 2px;
  font-size: 26px;
  font-weight: 300;
  color: #000b5b;
  line-height: 26px;
  letter-spacing: 1.2px;
  margin-top: 0;
}
#login-page .logo {
  width: 260px;
  height: auto;
  margin: 6px 0;
}
#login-page .separate {
  width: 100%;
  height: 1px;
  background: #7dc8ff;
  margin: 18px 0;
}

#login-page .q-card__section--vert {
  padding: 6px !important;
}

#login-page label.login-field .q-field__control,
#login-page label.login-field .q-field__marginal {
  height: 54px !important;
  padding-right: 12px !important;
  color: #0a74db !important;
  border-radius: 15px !important;
  background: #e3f2fd !important;
  border: 0;
  box-shadow: inset 0 1px 2px rgba(15, 60, 110, 0.06);
  transition: box-shadow 0.25s ease, background-color 0.25s ease;
}

/* Icon glyph itself — plain solid blue (no chip/background), matching the
   border/label accent color used across the rest of the field. */
#login-page label.login-field .q-field__control i,
#login-page label.login-field .q-field__marginal i {
  color: #0a74db !important;
  font-size: 20px !important;
}

#login-page .login-field .password-toggle {
  cursor: pointer;
  border-radius: 50%;
  transition: color 0.2s ease, background-color 0.2s ease;
}

#login-page .login-field .password-toggle:hover,
#login-page .login-field .password-toggle:focus-visible {
  color: #005fb8 !important;
  background: rgba(10, 116, 219, 0.1);
  outline: 2px solid rgba(10, 116, 219, 0.28);
  outline-offset: 3px;
}

/* Hover: a visible "this is interactive" cue before the user even clicks
   in — the outlined border alone doesn't read as clickable at a glance. */
#login-page .login-field:hover .q-field__control {
  box-shadow: inset 0 1px 2px rgba(15, 60, 110, 0.06),
    0 2px 8px rgba(13, 111, 188, 0.12);
}

/* Focus: a proper focus ring, not just the thin border-color swap the
   :after pseudo already does — the border alone is easy to miss,
   especially for keyboard/tab navigation. */
#login-page .login-field.q-field--focused .q-field__control {
  background: #ffffff !important;
  box-shadow: 0 0 0 4px rgba(63, 174, 255, 0.22),
    inset 0 1px 2px rgba(15, 60, 110, 0.06);
}

#login-page .q-field {
  font-size: 14px;
  margin: 0px 0px 10px;
}

#login-page .q-field__bottom--animated {
  /* bottom: 7px; */
  bottom: 6px !important;
}

#login-page .feature-content p {
  color: #111;
  text-align: justify;
  line-height: 24px;
  font-size: 14px;
  letter-spacing: 0.7px;
}

#login-page .q-field--outlined.login-field .q-field__control .q-field__label {
  font-size: 15px !important;
  top: 18px !important;
  letter-spacing: 1px !important;
  color: #0a74db !important;
  font-weight: 400 !important;
  border-radius: 5px;
}

#login-page .q-field--outlined .q-field__control:before {
  border: 0 !important;
}

#login-page .q-field--float .q-field__label {
  max-width: 132%;
  transform: translateY(-50%) scale(0.85);
  transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1),
    max-width 0.396s cubic-bezier(0.4, 0, 0.2, 1);
}

#login-page .login-field.q-field--highlighted .q-field__control:hover:before {
  border-color: transparent;
}

#login-page
  .login-field.q-field--outlined.q-field--highlighted
  .q-field__control:after {
  border-color: #009bff;
  border-width: 2px;
  transform: scale3d(1, 1, 1);
}

#login-page .login-field.q-field--highlighted .q-field__label {
  color: #0565b1;
}

#login-page .social-login-buttons {
  display: inline-flex;
}
#login-page .social-btn img {
  width: 45px;
  height: 45px;
  margin: 10px 4px;
  border: 1px solid #42afff;
  padding: 6px;
  border-radius: 50%;
}

#login-page .q-btn.btn-login {
  width: 100%;
  margin: 0;
  padding: 0;
  padding: 12px;
  background: linear-gradient(45deg, #00c6ff, #0072ff);
  box-shadow: 0 5px 10px rgba(0, 114, 255, 0.4) !important;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  color: white;
  border: none;
  border-radius: 10px;
  margin-top: 0;
  text-transform: uppercase;
}

#login-page .q-btn.btn-login .q-btn__content {
  transition: all 0.4s ease !important;
}

#login-page .q-btn.btn-login:hover .q-btn__content {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 114, 255, 0.6) !important;
}

#login-page .q-field__messages {
  line-height: 3px;
}

#login-page .footer-links {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
#login-page .footer-links a {
  color: #6f6f8f;
  text-decoration: none;
  letter-spacing: 0.5px;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@media (min-width: 1500px) and (max-width: 1700px) {
  #login-page .q-card.login-box {
    scale: 0.85;
  }
}

@media (min-width: 1200px) and (max-width: 1499px) {
  #login-page .q-card.login-box {
    background: rgb(255 255 255 / 91%);
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
    padding: 25px 30px;
    border-radius: 20px;
    width: 360px;
    max-width: 90%;
    text-align: center;
    border: 0 !important;
    /* Same fix as the base rule — constant subtle glow instead of the
       pulsing animation, so it doesn't look different depending on when
       you caught it. */
    box-shadow: 0 0 10px rgba(100, 220, 255, 0.3),
      0 0 20px rgba(100, 220, 255, 0.2), 0 0 30px rgba(100, 220, 255, 0.1) !important;
  }

  #login-page .q-field--outlined.login-field .q-field__control .q-field__label {
    margin-top: 0;
    margin-bottom: 10px;
    border: 0;
  }

  #login-page .footer-links a {
    font-size: 12px;
  }

  #login-page .q-card.login-box h1 {
    margin-top: 0;
  }

  #login-page .logo {
    width: 235px;
    height: auto;
    margin: 3px 0 0;
  }

  #login-page .social-btn img {
    width: 36px;
    height: 36px;
    margin: 0;
    border: 1px solid #42afff;
    padding: 4px;
    border-radius: 50%;
  }

  #login-page .feature-content p {
    color: #111;
    text-align: justify;
    line-height: 20px;
    font-size: 12px;
    letter-spacing: 0.8px;
  }
  #login-page .separate {
    width: 100%;
    height: 1px;
    background: #7dc8ff;
    margin: 15px 0 15px;
  }

  #login-page .q-field__control {
    height: 50px !important;
  }
}

@media (max-width: 767px) {
  #login-page .login-box {
    width: 320px;
    padding: 18px;
  }
  #login-page .logo {
    width: 220px;
    height: auto;
    margin: 5px 0;
  }
  #login-page .q-card.login-box {
    padding: 20px 20px;
  }

  #login-page .social-btn img {
    width: 38px;
    height: 38px;
    margin: 10px 4px;
    border: 1px solid #42afff;
    padding: 4px;
    border-radius: 50%;
  }

  #login-page .feature-content p {
    line-height: 22px;
    font-size: 13px;
    letter-spacing: 0.7px;
    margin-bottom: 5px;
    display: none;
  }

  #login-page .separate {
    margin: 8px 0;
    display: none;
  }

  #login-page .q-btn.btn-login {
    padding: 8px;
    font-size: 14px;
  }

  #login-page .q-field__control {
    height: 40px;
  }

  #login-page .q-field__marginal {
    height: 40px;
  }

  #login-page .q-field--float .q-field__label {
    top: 12px;
  }
}
</style>

<style>
/* Professional Notification Styling */
.notification-error {
  border-radius: 8px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  padding: 16px 20px !important;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
  border-left: 5px solid #a93226 !important;
  animation: slideInDown 0.4s ease-out !important;
}

.notification-error .q-notification__icon {
  font-size: 20px;
  margin-right: 10px;
}

.notification-error .q-notification__content {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: white;
}

.notification-error .q-notification__actions {
  padding-left: 10px;
}

.notification-error .q-notification__actions button {
  min-width: 32px !important;
  padding: 4px 8px !important;
}

.notification-error .q-notification__actions button:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 4px;
}

@keyframes slideInDown {
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

/* Jost/Roboto/Rubik/Rajdhani are now loaded from index.template.html's
   <head> (preconnect + a single consolidated stylesheet link) instead of
   from here — a component-level @import only starts downloading once
   this route's JS chunk is fetched and parsed, which is late enough on a
   fresh/direct load of "/" that the first paint used the browser's
   fallback font before swapping to the real one, looking different from
   later in-app navigations where the font was already cached. Loading
   from <head> starts the fetch immediately for every entry point instead. */
</style>
