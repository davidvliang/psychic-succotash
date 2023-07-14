const express = require("express");
const socketIo = require("socket.io", "net");
const http = require("http");
const { spawn } = require("child_process");

// SocketIO needs HTTP server to work. 
// You can’t do app.use(socketIo) here like you’d normally do with libraries such as CORS. 
// Instead, create an HTTP server and wrap the express app inside it.
const app = express();
const server = http.createServer(app);
const PORT = 5001;

// SOCKET EVENTS
const serverLog = "serverLog";
const submit = "submit";
const stopButton = "stopButton";
const programRunning = "programRunning";

const io = socketIo(server, {
  cors: {
    origin: "http://192.168.50.113:3000",
  },
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  // Listen for Client to Press Submit
  socket.on(submit, (data) => {
    io.emit(programRunning, true);

    // spawn new child process to call python script
    // const python = spawn("python", ["./scripts/test.py", JSON.stringify(data)]);
    const python = spawn("python", [
      "./scripts/dummy_script.py",
      JSON.stringify(data),
    ]);
    // collect data from script
    python.stdout.on("data", function (data) {
      dataToSend = data.toString();
      logPrint("[Python Output] ", dataToSend);
    });

    socket.on(stopButton, (data) => {
      python.stdin.write(data);
    });

    // in close event we are sure that the stream from child process is closed
    python.on("close", (code) => {
      logPrint(`[Python Output] Return ${code}`);
      io.emit(programRunning, false);
    });

    console.log(`[${getTS()}]`, "[Client]\n", data);
  });

  socket.on("disconnect", (reason) => {
    console.log("client disconnected", reason);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`[${getTS()}] Server Started on PORT ${PORT}`);
});

function getTS() {
  const timestamp = Date.now(); // This would be the timestamp you want to format

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

function logPrint(domain, ...args) {
  io.emit(serverLog, `[${getTS()}] ${domain} ${args.toString()}`);
  console.log(`[${getTS()}] ${domain} ${args.toString()}`);
}
