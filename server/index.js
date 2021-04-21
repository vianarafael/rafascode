const express = require("express");
const app = express();
const path = require("path");
const socket = require("socket.io");
const cors = require("cors");

const PORT = 5000;
const server = app.listen(PORT, () =>
  console.log(`listening to requests on port ${PORT} 🚀🚀🚀`)
);

app.use(cors());

app.use(express.static(path.join(__dirname, "../client/build/")));

app.get("/", (req, res) =>
{
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
})


// Socket setup
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    }
});

io.on("connection", socket =>
{
  console.log("made socket connection");
  
  socket.on("chat", data =>
  {
        console.log(data)
        io.emit("chat", data);
      });
  
  socket.on("code", data =>
  {
    console.log('here', data)
    io.emit("code", data);
      })

})

io.on("disconnect", (evt) => {
  console.log("some people left");
});