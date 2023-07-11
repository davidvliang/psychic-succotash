import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import CellArray from "./CellArray";
import LogOutput from "./LogOutput";

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

function TopInterface() {
  const [buttonData, setButtonData] = useState<string>(
    `[${getTS()}] [Info] Init App..`
  );
  const [backendData, setBackendData] = useState<any>(false);
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
        // setLogStorage(logStorage.concat(JSON.stringify(backendData,null, 2)) + "\n");

        console.log(backendData);
      });
  }, []);

  return (
    <>
      <h2>Cell Configuration</h2>
      <div className="">
        <div className="row">
          <div className="col col-sm-8">
            <CellArray />
          </div>
          <div className="col col-sm-4">
            <b>Instructions:</b>
            <ol>
              <li>Select Cells</li>
              <li>Click Submit</li>
            </ol>
            <br />
            <div className="btn-toolbar" role="toolbar">
              <button
                className="btn btn-success me-2 mb-2"
                id="submitButton"
                type="submit"
                value="Submit"
                onClick={(event) => {
                  event.stopPropagation();
                  fetch("/api")
                    .then((response) => response.json())
                    .then((data) => {
                      setBackendData(data);
                      setButtonData(
                        `[${getTS()}] [Python Output] ${backendData.data}`
                      );
                      // console.log(backendData);
                    });
                  // setButtonData(`[${getTS()}] [Debug] Submit Button Pressed`);
                }}
              >
                Submit
              </button>
              <button
                className="btn btn-secondary me-2 mb-2"
                id="submitButton"
                type="reset"
                value="Reset"
                onClick={() => {
                  setButtonData(`[${getTS()}] [Debug] Reset Button Pressed`);
                }}
              >
                <FontAwesomeIcon icon={faRefresh} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogOutput buttonData={buttonData} />
    </>
  );
}

export default TopInterface;
