<template><div class="hide-overflow">
    <div v-if="loading" class="loader-container">
      <span class="loader"></span>
    </div>
    <div v-else>
      <q-page id="login-page-ml2">
        <div class="overlay"></div>
        <div class="particle-network" ref="particleNetwork"></div>

        <div class="login-container">
          <q-card class="login-box">
            <div class="hero-banner">
              <q-card-section class="text-center hero-content">
                <div class="welcome-row">
                  <span class="dash-line"></span>
                  <span class="welcome-dot"></span>
                  <h1>Welcome To</h1>
                  <span class="welcome-dot"></span>
                  <span class="dash-line"></span>
                </div>
                <div class="brand-row">
                  <img :src="logoSrc" alt="CargoNet" class="brand-logo" />
                </div>
              </q-card-section>
            </div>

            <q-card-section class="form-section q-pa-lg">
              <q-form
                method="post"
                id="loginForm"
                autocomplete="off"
                novalidate="novalidate"
                @submit="login"
              >
                <q-input bg-color="blue-1"
                  ref="usernameFieldRef"
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
                  ref="passwordFieldRef"
                  outlined
                  class="login-field"
                  v-model.trim="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[
                    (v) =>
                      (v && v.length >= 6) ||
                      'Password must be atleast 6 chars',
                  ]"
                >
                  <template #prepend>
                    <q-icon name="lock" />
                  </template>
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="password-toggle"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <q-btn type="submit" class="btn-login" unelevated>
                  <span class="btn-login-label">LOGIN</span>
                  <span class="btn-login-arrow">
                    <q-icon name="arrow_forward" />
                  </span>
                </q-btn>

                <div class="footer-links">
                  <span class="dash-line"></span>
                  <a href="#">Forgot password?</a>
                  <span class="dash-line"></span>
                </div>
              </q-form>

              <div class="feature-box q-mt-md q-mb-md">
                <div class="feature-icon">
                  <q-icon name="campaign" />
                </div>
                <p>
                  <strong>New Features :</strong> CargoNet Real time Cargo
                  Tracking is easy to use online cargo tracking application that
                  integrates seamlessly with the website to give real time
                  status information.
                </p>
              </div>

              <div class="social-login-section">
                <div
                  class="social-buttons row justify-center items-start no-wrap"
                >
                  <div class="social-item">
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
                    <span class="social-label">Website</span>
                  </div>
                  <div class="social-divider" />
                  <div class="social-item">
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
                    <span class="social-label">Facebook</span>
                  </div>
                  <div class="social-divider" />
                  <div class="social-item">
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
                    <span class="social-label">Twitter</span>
                  </div>
                  <div class="social-divider" />
                  <div class="social-item">
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
                    <span class="social-label">LinkedIn</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </div>
  </div></template>

<script>
// Same login logic as pages/LoginPage.vue (MainLayout1's login screen) —
// this component only exists to give MainLayout2 its own dark-glass visual
// design; the actual authentication flow is identical, so it's kept as a
// straightforward copy rather than something clever/fragile like sharing
// one template between two very differently-styled pages.
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
          this.loading = true;

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
            const APIAccessCode = response.data.accessCode;
            const APIExpiresAt = response.data.expires;

            if (this.statuscount === 0) {
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
                  this.$router.replace({ path: "/" });
                }, timeUntilExpiration);
              }
            } else {
              this.UserLocked = true;
            }
          } else {
            this.$q.notify({
              message: response.data.message || "Invalid UserName or Password",
              color: "negative",
              position: "center",
              timeout: 5000,
              classes: "negative-alert",
              actions: [{ icon: "close", round: true, dense: true }],
            });
          }
        } catch (error) {
          this.$q.notify({
            message: "Invalid UserName or Password",
            color: "negative",
            position: "center",
            timeout: 5000,
            classes: "negative-alert",
            actions: [{ icon: "close", round: true, dense: true }],
          });
        } finally {
          this.loading = false;
        }
      } else if (
        !this.isValidLogin &&
        window.location.hash === "#/AutoWtsAppMsg"
      ) {
        try {
          this.loading = true;

          const response = await axios.get(
            `${Login_API}/Login/` + "ICTQRAdmin"
          );

          if (response.data && response.data.length > 0) {
            const APIUserID = response.data[0].id;
            const APIEmail = response.data[0].userName;
            const APIAccessCode = response.data[0].accessCode;
            const APIExpiresAt = response.data[0].expires;

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
                this.$router.replace({ path: "/" });
              }, timeUntilExpiration);
            }
          }
        } catch (error) {
          this.$q.notify({
            message: "Invalid UserName or Password",
            color: "negative",
            position: "top",
            timeout: 5000,
            classes: "negative-alert",
            actions: [{ icon: "close", round: true, dense: true }],
          });
          console.error(error);
        } finally {
          this.loading = false;
        }
      } else {
        this.showAlert = true;
      }
    },
    GetUserStatus() {
      if (MOCK_LOGIN_MODE) return;
      axios
        .get(`${Login_API}/Login/${this.email}/userstatus`)
        .then((res) => {
          this.statuscount = res.data[0].Usercount;
          this.Activecount = res.data[0];
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
    },
    Updateloginstatus() {
      if (MOCK_LOGIN_MODE) return;
      if (
        this.sessionId !== undefined ||
        this.sessionId !== "" ||
        this.sessionId !== null
      ) {
        return axios
          .put(`${Login_API}/Login/updateloginstatus`, {
            User: this.email ? this.email : sessionStorage.getItem("APIEmail"),
            Sessionid: this.sessionId ? this.sessionId : "",
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
const logoSrc = require("../assets/cargonet-logo---animation-white.gif");
const cargonetIconSrc = require("../images/cargonet.png");
const facebookIconSrc = require("../images/facebook.png");
const twitterIconSrc = require("../images/twitter.png");
const linkedinIconSrc = require("../images/linkedin.png");
const showPassword = ref(false);
const usernameFieldRef = ref(null);
const passwordFieldRef = ref(null);

function handleSocialLogin(provider) {
  console.log("social login:", provider);
}

// --- PARTICLE / ICON NETWORK (identical to LoginPage.vue's) ---
let animationFrame = null;
let resizeObserver = null;

onMounted(() => {
  initParticleNetwork();
  attachAutofillWorkaround(usernameFieldRef);
  attachAutofillWorkaround(passwordFieldRef);
});

onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (resizeObserver) resizeObserver.disconnect();
  detachAutofillWorkaround(usernameFieldRef);
  detachAutofillWorkaround(passwordFieldRef);
});

// --- CHROME AUTOFILL BACKGROUND WORKAROUND ---
// Current Chrome renders autofilled fields via its own undocumented
// internal pseudo-class (:-internal-autofill-selected), whose
// background-color genuinely cannot be overridden from an author
// stylesheet by any CSS technique — Chrome intentionally locked this
// down (2024 anti-phishing hardening) so pages can't visually disguise
// that a field was autofilled. The CSS fix in this file's <style> block
// covers the older, standard :-webkit-autofill state, but this internal
// one needs a different lever: Chrome fires a plain "input" event with
// no `inputType` when it autofills a field (real typing always sets
// inputType), and re-assigning the input's own value right after that —
// identical content, just done via script instead of by the browser's
// autofill machinery — clears Chrome's internal "this value came from
// autofill" flag, which is what the unstylable state is keyed on. This
// only touches the DOM node's .value, not the v-model itself, so it
// can't fight Vue for control of the field, and (unlike an earlier
// focus()/blur()-based attempt at this same problem on LoginPage.vue)
// never moves focus or pops an on-screen keyboard.
function handlePossibleAutofill(event) {
  if (event.inputType) return; // real user input always sets this
  const el = event.target;
  requestAnimationFrame(() => {
    el.value = el.value;
  });
}
function attachAutofillWorkaround(fieldRef) {
  const nativeEl = fieldRef.value?.nativeEl;
  if (nativeEl) nativeEl.addEventListener("input", handlePossibleAutofill);
}
function detachAutofillWorkaround(fieldRef) {
  const nativeEl = fieldRef.value?.nativeEl;
  if (nativeEl) nativeEl.removeEventListener("input", handlePossibleAutofill);
}

function initParticleNetwork() {
  const container = particleNetwork.value;
  if (!container) return;

  const bgCanvas = document.createElement("canvas");
  bgCanvas.style.position = "absolute";
  bgCanvas.style.top = "0";
  bgCanvas.style.left = "0";
  bgCanvas.style.width = "100%";
  bgCanvas.style.height = "100%";
  bgCanvas.style.zIndex = "0";
  container.appendChild(bgCanvas);
  const ctx = bgCanvas.getContext("2d");

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

  const iconParticles = [];
  const connections = [];
  let bgParticles = [];

  const maxSize = 80;
  const minSize = 48;

  function randBetween(a, b) {
    return a + Math.random() * (b - a);
  }

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
      x: startPos.x,
      y: startPos.y,
      size,
      vx: randBetween(-0.001, 0.001),
      vy: randBetween(-0.001, 0.001),
    });

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
          const conn = document.createElement("div");
          conn.className = "particle-connection";
          conn.style.position = "absolute";
          conn.style.height = "1px";
          conn.style.background =
            "linear-gradient(to right, rgba(100,220,255,0.35), rgba(100,220,255,0.12))";
          conn.style.zIndex = "2";

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

    iconParticles.forEach((p) => {
      p.x = Math.min(0.98, Math.max(0.02, p.x));
      p.y = Math.min(0.98, Math.max(0.02, p.y));
    });

    initBgParticles(rect.width, rect.height);
    createConnections(rect.width, rect.height);
  }

  function animate() {
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    iconParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0.02 || p.x > 0.98) p.vx *= -1;
      if (p.y < 0.02 || p.y > 0.98) p.vy *= -1;

      p.element.style.left = `${p.x * w}px`;
      p.element.style.top = `${p.y * h}px`;
    });

    createConnections(w, h);

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

  resize();
  animate();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  window.addEventListener("resize", resize);
}
</script>
