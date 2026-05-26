import http from "http";

import { Server }
from "socket.io";

import app from "./app.js";

import { socketHandler }
from "./sockets/socket.handler.js";

import { verifyToken }
from "./utils/jwt.js";

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Auth Middleware
io.use((socket, next) => {

  try {

    const token =
      socket.handshake.auth?.token;

    if (token) {

      const decoded =
        verifyToken(token);

      socket.user = decoded;

    }

    next();

  } catch (error) {

    next(
      new Error("Unauthorized")
    );

  }
});

io.on(
  "connection",
  (socket) => {

    socketHandler(
      io,
      socket
    );

  }
);

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});