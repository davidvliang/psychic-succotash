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

// SOCKET EVENTS (see TopInterface.tsx)
const submit = "submit"; // 'submit' signal (client to server)
const stopButton = "stopButton"; // 'stop' signal (client to server)
const serverLog = "serverLog"; // send logging information from (server to client)
const programRunning = "programRunning"; // python script start (server to client)
const cellActuation = "cellActuation"; // indicate specific cell is actuated (server to client)

// Init socketIO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // CLIENT ADDRESS
  },
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  // Listen for Client to Press Submit
  socket.on(submit, (data) => {
    io.emit(programRunning, true);

    // Spawn new child process to call python script
    const python = spawn("python", [
      "-u",
      // "./scripts/actuation_v1.py",
      // "./scripts/actuation_v2.py",
      "./scripts/actuation_v3.py",
      // "./scripts/testbench/dummy_script.py",
      // "./scripts/testbench/dummy_script_2.py",
      JSON.stringify(data),
    ]);

    // If stop button is pressed, send 'stop' to python script
    socket.on(stopButton, (data) => {
      python.stdin.write(data);
      logPrint("[Server]", "Sending 'STOP' to Python process");
    });

    // Send STDOUT data from python script to client
    python.stdout.on("data", function (data) {
      dataToSend = data.toString();
      logPrint("[Python STDOUT] ", dataToSend);
      if (dataToSend.startsWith("actuated cell ")) {
        io.emit(cellActuation, dataToSend);
      }
    });

    // Send STDERR from python script to client log output
    python.stderr.on("data", function (data) {
      dataToSend = data.toString();
      logPrint("[Python STDERR] ", dataToSend);
    });

    // in close event we are sure that the stream from child process is closed
    python.on("close", (code, signal) => {
      logPrint(`[Server] Python process terminated with return code ${code}`);
      logPrint(`[Server] Python process terminated due to signal ${signal}`);
      io.emit(programRunning, false);
    });

  });

  socket.on("disconnect", (reason) => {
    console.log("client disconnected", reason);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`[${getTS()}] Server Started on PORT ${PORT}`);
});


// Timestamp string for labeling log output
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

// Wrapper function for displaying log output
function logPrint(domain, ...args) {
  io.emit(serverLog, `[${getTS()}] ${domain} ${args.toString()}`);
  console.log(`[${getTS()}] ${domain} ${args.toString()}`);
}
