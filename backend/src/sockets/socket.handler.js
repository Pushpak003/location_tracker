const liveLocations = {};

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

      // INSTANT SEND
      const lastLocation =
        liveLocations[
          trackingId
        ];

      if (lastLocation) {

        socket.emit(
          "receive-location",
          lastLocation
        );

      }

    }
  );

  // Sender sends location
  socket.on(
    "send-location",
    (data) => {

      // SAVE LAST LOCATION
      liveLocations[
        data.trackingId
      ] = {
        latitude:
          data.latitude,

        longitude:
          data.longitude,

        userId:
          socket.user?.id,
      };

      // BROADCAST
      socket.to(
        data.trackingId
      ).emit(
        "receive-location",

        liveLocations[
          data.trackingId
        ]
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