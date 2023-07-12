import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import { io } from "socket.io-client";
import ConfigurationForm from "./ConfigurationForm";
import LogOutput from "./LogOutput";
import getTS from "../utils/getTS";

// SOCKET EVENTS
const serverLog = "serverLog";
const submit = "submit";
const abortButton = "abortButton";

// INIT Sockets
const socket = io("http://192.168.50.113:5001");

function TopInterface() {
  const [logData, setLogData] = useState<string>(
    `[${getTS()}] [Client] Init App..`
  );
  const [resetButton, setResetButton] = useState(false);
  const [configureData, setConfigureData] = useState([{}]);

  const handleConfigureData = useCallback(
    (data: object) => {
      socket.emit(submit, data);
    },
    [configureData]
  );
  // socket.onAny((event, ...args) => {
  //   console.log("CLIENT SOCKET DEBUG", event, args);
  // });
  socket.on("connect_error", () => setTimeout(() => socket.connect(), 5000));
  socket.on("connect", () =>
    setLogData(`[${getTS()}] [Client] Connected to Server [ID: ${socket.id}]`)
  );
  socket.on("disconnect", () =>
    setLogData(`[${getTS()}] [Client] Disconnected from Server.`)
  );

  socket.on(serverLog, (data) => {
    setLogData(data);
  });

  return (
    <div className="">
      <ConfigurationForm
        resetButton={resetButton}
        handleConfigureData={handleConfigureData}
      />

      <div className="row mt-md-2">
        <div className="col ms-auto px-md-0">
          <div className="btn-toolbar float-end" role="toolbar">
            <button
              className="btn btn-danger ms-2 my-2"
              id="abortButton"
              type="button"
              value="Abort"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Abort Button Pressed`);
                socket.emit(abortButton, "q\n");

                // socket.emit(abortButton, "Abort Button Pressed.");
              }}
            >
              Stop Program (SIGINT)
            </button>
            <button
              className="btn btn-success ms-2 my-2"
              id="submitButton"
              type="submit"
              form="configForm"
              value="Submit"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Submit Button Pressed.`);
              }}
            >
              Submit
            </button>

            <button
              className="btn btn-secondary ms-2 my-2"
              id="resetButton"
              type="reset"
              value="Reset"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Reset Button Pressed`);
                setResetButton(!resetButton);
              }}
            >
              <FontAwesomeIcon icon={faRefresh} />
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <LogOutput logData={logData} />
      </div>
    </div>
  );
}

export default TopInterface;
