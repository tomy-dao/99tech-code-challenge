export const config = {
  apiUrl: 'http://localhost:3000/api',
  socketUrl: import.meta.env.VITE_SOCKET_BASE_URL || 'ws://localhost:8080/chat',
}
