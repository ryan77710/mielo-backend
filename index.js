const mongoose = require("mongoose");

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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
};
const io = require("socket.io")(httpServer, options);
let userPos = {};
io.on("connection", (socket) => {
  socket.on("login", (arg) => {
    socket.emit("newUser", arg);
  });
});

httpServer.listen(process.env.PORT || 3200, () => {
  console.log("server has started");
});
