export const VoiceRegistry = {
  current: null,

  register(handler) {
    this.current = handler;
  },

  unregister() {
    this.current = null;
  },

  dispatch(text, route) {
    if (this.current) {
      this.current(text, route);
    }
  },
};
