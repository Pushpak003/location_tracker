import { verifyToken }
from "../utils/jwt.js";

export const socketHandler =
(io, socket) => {

  console.log(
    "Socket Connected"
  );

  // Viewer joins tracking
  socket.on(
    "watch-tracking",
    (trackingId) => {

      socket.join(trackingId);

      console.log(
        `Watching ${trackingId}`
      );

    }
  );

  // Sender sends location
  socket.on(
    "send-location",
    (data) => {

      io.to(
        data.trackingId
      ).emit(
        "receive-location",
        {
          latitude:
            data.latitude,

          longitude:
            data.longitude,

          userId:
            socket.user?.id,
        }
      );

    }
  );

  socket.on(
    "disconnect",
    () => {

      console.log(
        "Socket disconnected"
      );

    }
  );
};