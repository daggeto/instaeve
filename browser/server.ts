import Express from "express";
import Http from "http";
import Socket from "socket.io";

const app = Express();
const http = new Http.Server(app);
const io = new Socket(http);

io.on("connection", function(socket) {
  console.log("a user connected");
  io.emit("some event", { for: "everyone" });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
