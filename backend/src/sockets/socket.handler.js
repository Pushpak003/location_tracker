import { verifyToken }
from "../utils/jwt.js";

export const socketHandler = (io) => {

  // Auth Middleware
  io.use((socket, next) => {

    try {

      const token =
        socket.handshake.auth.token;

      if (!token) {
        return next(
          new Error("Unauthorized")
        );
      }

      const decoded =
        verifyToken(token);

      socket.user = decoded;

      next();

    } catch (error) {

      next(
        new Error("Unauthorized")
      );

    }
  });

  io.on("connection", (socket) => {

    console.log(
      `${socket.user.email} connected`
    );

    // Viewer joins tracking
    socket.on(
      "watch-tracking",
      (trackingId) => {

        socket.join(trackingId);

        console.log(
          `Watching tracking ${trackingId}`
        );

      }
    );

    // Sender sends location
    socket.on(
      "send-location",
      (data) => {

        io.to(data.trackingId).emit(
          "receive-location",
          {
            latitude:
              data.latitude,

            longitude:
              data.longitude,

            userId:
              socket.user.id,
          }
        );

      }
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          `${socket.user.email} disconnected`
        );

      }
    );

  });
};