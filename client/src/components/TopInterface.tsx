import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState, useEffect } from "react";
import { io } from "socket.io-client";
// import ConfigurationForm from "./ConfigurationForm";
import LookupTableForm from "./TiledArrayForm";
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
  const [downloadButton, setDownloadButton] = useState<number>(0);
  const [submitData, _] = useState<object>([{}]);
  const [formDisabled, setFormDisabled] = useState<boolean>(false);
  const [actuatedCells, setActuatedCells] = useState<object>(
    JSON.parse(JSON.stringify(defaultActuatedCells))
  );

  // Send data to backend
  const handleSubmitData = useCallback(
    (data: object) => {
      socket.emit(submit, data);
    },
    [submitData]
  );

  // Reset Actuated Cells when Stop Button is pressed.
  useEffect(() => {
    if (!formDisabled) {
      setActuatedCells(JSON.parse(JSON.stringify(defaultActuatedCells)))
    }
  }, [formDisabled]);

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
      ...{ [cellVal as keyof typeof actuatedCells]: true }
    }));
  });
  
  return (
    <div className="">

      <nav className="navbar sticky-top navbar-light bg-light mb-5 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand pt-2 mx-auto my-auto mx-md-5 h1 text-align-center">Control System App</span>

          <div className="btn-toolbar float-end mx-md-5" role="toolbar">

            {/* DOWNLOAD BUTTON */}
            <button
              className="btn btn-secondary ms-2 my-2"
              id="stopButton"
              type="button"
              value="Download"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Download Button Pressed`);
                setDownloadButton(downloadButton+1)
              }}
              disabled={formDisabled}
            >
              Download Configuration
            </button>

            {/* STOP BUTTON */}
            <button
              className="btn btn-danger ms-2 my-2"
              id="stopButton"
              type="button"
              value="Stop"
              onClick={() => {
                setLogData(`[${getTS()}] [Client] Stop Button Pressed`);
                socket.emit(stopButton, "SIGINT\n");
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
      </nav>

      {/* CONFIGURATION FORM COMPONENT */}
      {/* <ConfigurationForm
        resetButton={resetButton}
        handleSubmitData={handleSubmitData}
        formDisabled={formDisabled}
        actuatedCells={actuatedCells}
      /> */}
      {/* LOOKUP TABLE FORM COMPONENT */}
      <div className="">

        <LookupTableForm
          resetButton={resetButton}
          downloadButton={downloadButton}
          handleSubmitData={handleSubmitData}
          formDisabled={formDisabled}
          actuatedCells={actuatedCells}
        />
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />





      {/* LOG OUTPUT COMPONENT */}
      <div className="container">
        <LogOutput logData={logData} />
      </div>
    </div>
  );
}

export default TopInterface;
