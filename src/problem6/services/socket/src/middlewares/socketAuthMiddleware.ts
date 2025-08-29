import { Socket } from "socket.io";
import { getMe } from "../clients/backendClient";

export async function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("Unauthorized: no token"));

    const {user} = await getMe(token);

    // Gắn thông tin vào socket để dùng ở handler sau này
    socket.data.userId = user._id;
    socket.data.username = user.username;

    // Có thể auto-join 1 room riêng của user (tiện push notification riêng)
    socket.join(`user:${user.user_id}`);

    return next();
  } catch (e: any) {
    console.log("socketAuthMiddleware error", e);
    return next(new Error("Unauthorized: invalid token"));
  }
}