// Base URL for the LAN chat server (see /chat-server at the repo root).
// This is a SEPARATE service from Login_API/CargoNet_API — it only serves
// the chat box's message history/send endpoints and its Socket.io stream.
//
// Point this at the LAN IP + port of whichever office machine is running
// `chat-server` (see chat-server/README.md for how to find that IP and run
// it) — "localhost" only ever means "this machine" to each computer, so it
// will NOT let other devices on the network reach the chat server.
const Chat_API = "http://localhost:5050/api";

export default Chat_API;
