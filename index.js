const mongoose = require("mongoose");
const handleLocation = require("./utils/handleLocation").handleLocation;
const userDeconnection = require("./utils/userDeconnection").userDeconnection;

//-------------
// const app = require("./src/app");

// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });
// app.listen(process.env.PORT || 3200, () => {
//   console.log("server has started");
// });

const app = require("./src/app");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const httpServer = require("http").createServer(app);
const options = {
  cors: {
    origin: process.env.URL,
    methods: ["GET", "POST"],
  },
};
const io = require("socket.io")(httpServer, options);
let userPos = {};
io.on("connection", (socket) => {
  socket.on("login", (arg) => {
    socket.emit("newUser", arg);
  });
  // socket.on("disconnecting", () => {
  //   console.log("disconnecting"); // the Set contains at least the socket ID
  // });

  socket.on("deconnection", (arg) => {
    console.log("deconnection");
    // socket.rooms.size === 0;
    userDeconnection(arg);
  });
  socket.on("userPos", (arg) => {
    handleLocation(arg);
  });
  // socket.on("terminate", () => {
  //   console.log("terminate");
  //   socket.disconnect(0);
  // });
});

httpServer.listen(process.env.PORT || 3200, () => {
  console.log("server has started");
});
