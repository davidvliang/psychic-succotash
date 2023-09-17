import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import { io } from "socket.io-client";
import ConfigurationForm from "./ConfigurationForm";
import LogOutput from "./LogOutput";
import getTS from "../utils/getTS";
import { defaultActuatedCells } from "../utils/DAQ";

// SOCKET EVENTS (see server.js)
const submit = "submit"; // 'submit' signal (client to server)
const stopButton = "stopButton"; // 'stop' signal (client to server)
const serverLog = "serverLog"; // send logging information from (server to client)
const programRunning = "programRunning"; // python script start (server to client)
const cellActuation = "cellActuation"; // indicate specific cell is actuated (server to client)

// INIT Sockets
const socket = io("http://localhost:5001");

function TopInterface() {
  const [logData, setLogData] = useState<string>(
    `[${getTS()}] [Client] Init App..`
  );
  const [resetButton, setResetButton] = useState<boolean>(false);
  const [configureData, setConfigureData] = useState<object>([{}]);
  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const [actuatedCells, setActuatedCells] = useState<object>(
    JSON.parse(JSON.stringify(defaultActuatedCells))
  );

  const handleConfigureData = useCallback(
    (data: object) => {
      socket.emit(submit, data);
    },
    [configureData]
  );

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
  socket.on(programRunning, (data) => {
    setFormDisabled(data);
  });

  // Keep track of which individual cells have been actuated by the python script
  // Used for demo purposes to highlight the actuated cells in green on the frontend 
  socket.on(cellActuation, (data) => {
    const cellVal = parseInt(data.split(" ").at(-1));
    setActuatedCells(actuatedCells => ({
      ...actuatedCells,
      ...{[cellVal as keyof typeof actuatedCells]: true}
    }));
  });

  return (
    <div className="">

      {/* CONFIGURATION FORM COMPONENT */}
      <ConfigurationForm
        resetButton={resetButton}
        handleConfigureData={handleConfigureData}
        formDisabled={formDisabled}
        actuatedCells={actuatedCells}
      />

      <div className="row mt-md-1">
        <div className="col ms-auto px-md-0">
          <div className="btn-toolbar float-end" role="toolbar">

            {/* STOP BUTTON */}
            <button
              className="btn btn-danger ms-2 my-2"
              id="stopButton"
              type="button"
              value="Stop"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Stop Button Pressed`);
                setActuatedCells(
                  JSON.parse(JSON.stringify(defaultActuatedCells))
                );
                socket.emit(stopButton, "SIGINT\n");
                // socket.emit(stopButton, "Stop Button Pressed.");
              }}
              disabled={!formDisabled}
            >
              Stop Program
            </button>

            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-success ms-2 my-2"
              id="submitButton"
              type="submit"
              form="configForm"
              value="Submit"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Submit Button Pressed.`);
                // setFormDisabled(true);
              }}
              disabled={formDisabled}
            >
              Submit
            </button>

            {/* RESET BUTTON */}
            <button
              className="btn btn-secondary ms-2 my-2"
              id="resetButton"
              type="reset"
              value="Reset"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Reset Button Pressed`);
                setResetButton(!resetButton);
              }}
              disabled={formDisabled}
            >
              <FontAwesomeIcon icon={faRefresh} />
            </button>

          </div>
        </div>
      </div>
      <br />
      <br />
      {/* LOG OUTPUT COMPONENT */}
      <div className="row">
        <LogOutput logData={logData} />
      </div>
    </div>
  );
}

export default TopInterface;
