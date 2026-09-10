<template>
  <div class="chat-container">
    <!-- Header: signed-in user (top row) + chat-partner picker (bottom row) -->
    <div class="chat-header">
      <div class="chat-header-top">
        <div class="chat-header-me">
          <div
            class="chat-header-avatar"
            :style="{ background: getAvatarColor(userid) }"
          >
            {{ getInitials(currentUserName) }}
          </div>
          <div class="chat-header-me-text">
            <span class="chat-header-me-label">Signed in as</span>
            <span class="chat-header-me-name">{{ currentUserName }}</span>
          </div>
        </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          size="sm"
          class="chat-close-btn"
          @click="$emit('close')"
        >
          <q-tooltip>Close chat</q-tooltip>
        </q-btn>
      </div>

      <q-select
        v-model="selectedUser"
        :options="otherUsers"
        dense
        borderless
        options-dense
        class="user-select"
        option-label="label"
        option-value="value"
        placeholder="Select a user to chat with"
        @update:model-value="onUserChange"
      >
        <template v-slot:prepend>
          <q-icon name="fa-regular fa-comments" size="16px" class="user-select-icon" />
        </template>
        <template v-slot:selected>
          <div v-if="selectedUser" class="user-select-chip">
            <div
              class="chat-mini-avatar"
              :style="{ background: getAvatarColor(selectedUser.value) }"
            >
              {{ getInitials(selectedUser.label) }}
            </div>
            <span>{{ selectedUser.label }}</span>
          </div>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <div
                class="chat-mini-avatar"
                :style="{ background: getAvatarColor(scope.opt.value) }"
              >
                {{ getInitials(scope.opt.label) }}
              </div>
            </q-item-section>
            <q-item-section>{{ scope.opt.label }}</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div ref="chatMessages" class="chat-messages">
      <div v-if="!selectedUser" class="chat-empty-state">
        <q-icon name="fa-regular fa-comments" size="32px" />
        <span>Pick a user above to start chatting</span>
      </div>
      <div v-else-if="messages.length === 0" class="chat-empty-state">
        <q-icon name="fa-regular fa-comment-dots" size="32px" />
        <span>No messages yet — say hi!</span>
      </div>
      <q-chat-message
        v-for="(message, index) in messages"
        :key="index"
        :name="
          message.Status === 'Receive' ? getname(message.Userid) : 'You'
        "
        :text="[message.Message]"
        :stamp="message.Time"
        :sent="message.Status === 'Send'"
        :bg-color="message.Status === 'Receive' ? 'blue-grey-1' : 'green-14'"
        :text-color="message.Status === 'Receive' ? 'black' : 'white'"
        class="q-mb-sm"
      >
        <template v-slot:avatar>
          <div
            class="chat-msg-avatar"
            :style="{
              background: getAvatarColor(message.Userid),
              [message.Status === 'Receive' ? 'marginRight' : 'marginLeft']:
                '8px',
            }"
          >
            {{ getInitials(getname(message.Userid)) }}
          </div>
        </template>
      </q-chat-message>
    </div>

    <div class="chat-footer">
      <q-input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        class="ChatInput"
        :disable="!selectedUser"
        borderless
        dense
      >
        <template v-slot:append>
          <q-icon
            name="send"
            class="chat-send-icon"
            :class="{ 'chat-send-icon--active': userInput.trim() }"
            @click="sendMessage"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { io } from "socket.io-client";
import CargoNet_API from "/src/IPConfig/config.js";
import Chat_API from "/src/IPConfig/configChat.js";

// Messages are persisted on the LAN chat server (see /chat-server at the
// repo root — Express + MongoDB) and pushed live via Socket.io, so people
// on the same office network can actually chat with each other in
// real time. The user directory (LoadUsers) still comes from the real
// CargoNet_API since that's unrelated to chat storage.
export default {
  emits: ["close"],
  data() {
    return {
      messages: [],
      userInput: "",
      Users: [],
      selectedUser: null,
      socket: null,
    };
  },
  computed: {
    // Chat-partner list should never include the logged-in user themselves,
    // nor placeholder/system entries like "Not Applicable" that some tenants
    // keep in the user directory but that no one can actually chat with.
    otherUsers() {
      return this.Users.filter(
        (u) =>
          u.value !== parseInt(this.userid) &&
          (u.label || "").trim().toLowerCase() !== "not applicable"
      );
    },
    // Prefer the name from the Users directory; if the logged-in user isn't
    // in that list for some reason, fall back to the email on file so the
    // header never shows a blank/"?" avatar.
    currentUserName() {
      const user = this.Users.find((u) => u.value === parseInt(this.userid));
      if (user) return user.label;
      const email = sessionStorage.getItem("APIEmail");
      if (email) {
        const localPart = email.split("@")[0];
        return localPart
          .split(/[._]/)
          .filter(Boolean)
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" ");
      }
      return "You";
    },
  },
  created() {
    this.userid = sessionStorage.getItem("APIUserID");
  },
  mounted() {
    this.LoadUsers();
    this.connectSocket();
  },
  beforeUnmount() {
    if (this.socket) this.socket.disconnect();
  },
  updated() {
    this.scrollToBottom(); // Scroll to bottom when new message is added
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });
    },
    // Joins a personal room on the chat server so any message sent to this
    // user (from anyone, on any device on the network) arrives instantly
    // instead of waiting for a poll/refresh.
    connectSocket() {
      this.socket = io(Chat_API.replace(/\/api\/?$/, ""));
      this.socket.on("connect", () => {
        this.socket.emit("chat:join", this.userid);
      });
      this.socket.on("chat:message", (msg) => {
        const isThisConversation =
          this.selectedUser &&
          [String(msg.fromId), String(msg.toId)].includes(this.userid) &&
          [String(msg.fromId), String(msg.toId)].includes(
            String(this.selectedUser.value)
          );
        if (isThisConversation) {
          this.messages.push({
            Userid: msg.Userid,
            Message: msg.Message,
            Time: msg.Time,
            Status:
              String(msg.Userid) === String(this.userid) ? "Send" : "Receive",
          });
        }
      });
    },
    onUserChange() {
      this.messages = [];
      // Remember the last-picked partner so reopening the chat resumes the
      // same conversation instead of resetting to the first user every time.
      if (this.selectedUser) {
        localStorage.setItem(
          "chatLastPartnerId",
          String(this.selectedUser.value)
        );
      }
      this.fetchMessages();
    },
    fetchMessages() {
      if (!this.selectedUser) return;
      axios
        .get(
          `${Chat_API}/chatbot/Get-message/${this.userid}/${this.selectedUser.value}`
        )
        .then((res) => {
          this.messages = (res.data || []).map((m) => ({
            ...m,
            Status:
              String(m.Userid) === String(this.userid) ? "Send" : "Receive",
          }));
        })
        .catch((error) => {
          console.error("Error fetching messages", error);
        });
    },
    sendMessage() {
      const userMessage = this.userInput.trim();
      if (userMessage === "" || !this.selectedUser) return;

      axios
        .post(`${Chat_API}/chatbot/Add-message`, {
          fromid: this.userid,
          toid: this.selectedUser.value,
          message: userMessage,
        })
        .then(() => {
          // Don't append it here — the server echoes every new message back
          // over the socket (to both participants, including the sender),
          // so the "chat:message" handler above is the normal place new
          // messages get added. As a safety net in case the socket isn't
          // connected, re-sync from the REST API too — harmless even if the
          // socket already delivered it, since this just re-fetches the
          // authoritative list from the server.
          this.userInput = "";
          this.fetchMessages();
        })
        .catch((error) => {
          console.error("Error sending message", error);
        });
    },
    LoadUsers() {
      axios
        .get(`${CargoNet_API}/industrydata/user`)
        .then((res) => {
          this.Users = (res.data || []).map((User) => ({
            label: User.name,
            value: User.id,
          }));
          // Resume the last partner you were chatting with (if they're still
          // in the directory), otherwise default to the first available chat
          // partner (never the logged-in user) — then load that conversation
          // right away.
          if (!this.selectedUser && this.otherUsers.length > 0) {
            const lastPartnerId = localStorage.getItem("chatLastPartnerId");
            const lastPartner = lastPartnerId
              ? this.otherUsers.find(
                  (u) => String(u.value) === lastPartnerId
                )
              : null;
            this.selectedUser = lastPartner || this.otherUsers[0];
            this.fetchMessages();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getInitials(label) {
      if (!label) return "?";
      const parts = label.trim().split(/\s+/).filter(Boolean);
      const initials = parts
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
      return initials || "?";
    },
    getname(user) {
      const match = this.Users.find((u) => u.value === user);
      return match ? match.label : "Unknown";
    },
    getAvatarColor(user) {
      const colors = [
        "#0067e0",
        "#00897b",
        "#e65100",
        "#6a1b9a",
        "#c2185b",
        "#2e7d32",
      ];
      const seed = user ? user.toString().charCodeAt(0) : 0;
      return colors[seed % colors.length];
    },
  },
};
</script>
