const mongoose = require("mongoose");
const handleLocation = require("./utils/handleLocation").handleLocation;
const userDeconnection = require("./utils/userDeconnection").userDeconnection;

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

io.on("connection", (socket) => {
  let authToken;
  socket.on("login", (arg) => {
    authToken = arg.authToken;
    socket.token = arg.authToken;
  });

  socket.on("deconnection", (arg) => {
    userDeconnection(socket.token);
  });
  socket.on("userPos", (arg) => {
    // authToken = arg.authToken;
    handleLocation(arg);
  });

  socket.on("disconnect", () => {
    if (!socket.token) {
      return false;
    }
    userDeconnection(socket.token);
  });
});

httpServer.listen(process.env.PORT || 3200, () => {
  console.log("server has started");
});
