// turn this into a class?
// https://legacy.reactjs.org/docs/forms.html
// turn into controlled component?
// https://react.dev/learn/sharing-state-between-components#

import { useEffect, useState } from "react";

// interface LogProps {
//   buttonData: string;
// };

// const LogOutput: React.FunctionComponent<LogProps> = (props) => {
// const LogOutput: React.FC<LogProps> = ({buttonData}) => {
const LogOutput = ({ buttonData }: { buttonData: string }) => {

  // const {buttonData} = props
  const [logStorage, setLogStorage] = useState("");
  useEffect(() => {
    setLogStorage(logStorage.concat(buttonData) + "\n");
  }, [buttonData]);

  return (
    <>
      <div className="my-4">
        <h2>Log</h2>
        <div className="form-group">
          <textarea
            readOnly
            className="form-control"
            id="LogOutputTextArea"
            rows={20}
            value={logStorage}
          >
            {/* {(typeof backendData.users === 'undefined') ? (
              <p>Loading...</p>
            ) : (
              backendData.users.map((user, i) => (
                <p key={i}>{user}</p>
              ))
            )} */}
          </textarea>
        </div>
      </div>
    </>
  );
};

// $('#LogOutputArea').value("hello");

export default LogOutput;
