import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { DAQInputs, alphabet } from "../utils/DAQ";
import { LookupTableType } from "../utils/LookupTableUtil";
import getTS from "../utils/getTS";
import { ReactComponent as InfoIcon } from "../assets/info-lg.svg"
import lookupTable from "../utils/lookupTable.json"

const ConfigurationForm = ({ resetButton, handleConfigureData, formDisabled, actuatedCells }: { resetButton: boolean, handleConfigureData: (data: object) => void, formDisabled: boolean, actuatedCells: object }) => {

  // Initialize form input using React-Hook-Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LookupTableType>();

  // Collect form data as JSON string upon submit
  const onSubmit: SubmitHandler<LookupTableType> = (data) => {
    let form_data = data;
    form_data["timestamp"] = getTS();
    handleConfigureData(form_data);
    console.log("form_data", form_data);
  };

  // Reset form values when reset button is pressed
  useEffect(() => {
    reset();
    setArrSize(4);
  }, [resetButton]);

  // Input Validation for Parameters
  const voltageError = {
    required: "Cannot be blank.",
    max: { value: 10, message: "Must be below 10V." },
    min: { value: -10, message: "Must be above -10V." },
  };
  const dutyCycleError = {
    required: "Cannot be blank.",
    max: { value: 100, message: "Must be percentage." },
    min: { value: 0, message: "Must be percentage." },
    pattern: { value: /^(0|[1-9]\d*)?$/, message: "Must be integer." },
  };
  const defaultError = {
    required: "Cannot be blank.",
    min: { value: 0, message: "Cannot be negative." },
    pattern: { value: /^(0|[1-9]\d*)?$/, message: "Must be integer." },
  };

  // Initialize parameters for adjusting array size
  const [arrSize, setArrSize] = useState<number>(4); // set dimension for array based on user input, default is 4x4
  const [cellArrayKey, setCellArrayKey] = useState<number>(69420); // set arbitrary key for the array's HTML element. Changing the key will cause re-render
  const [dmuxDimArr, setDmuxDimArr] = useState([...Array(arrSize).keys()]);
  const dimOptions = Array.from({ length: 16 }, (_, i) => i + 1) // used with map() to draw the list of array dimension options for the user to select

  // When user changes the array size
  useEffect(() => {
    setDmuxDimArr([...Array(arrSize).keys()]); // update dmuxDimArr, which is used to draw the cell array 
    setCellArrayKey(Math.random()) // cycle to a new key for #cellArrayDisplay, which re-renders the element
  }, [arrSize]);

  // Set styling for cells based on actuation (highlight green) and FormDisabled (submit button pressed)
  const styleCell = (elementID: string, _rowVal: number, _colVal: number) => {
    let cellElement = document.getElementById(elementID) as HTMLInputElement // grab input element by ID
    let actuateClassName = actuatedCells[String(_rowVal * arrSize + _colVal) as keyof typeof actuatedCells] ? "btn-success" : "" // highlight green when cell is actuated by python script
    let formDisabledClassName = formDisabled && !cellElement.checked ? "opacity-0" : "" // when form is disabled (when submit button pressed), hide the states that aren't checked
    return " " + formDisabledClassName + " " + actuateClassName + " " // return these conditional classNames
  }

  // Set styling for sections based on array size 
  const styleSectionGrids = (sectionName: string) => {

    const arrSizeThresOne = 6  // 0-5
    const arrSizeThresTwo = 11 // 6-10
    const arrSizeThresThree = 12 // 11-11
    if (sectionName === "File Upload" || sectionName === "Lookup Table") {
      if (arrSize < arrSizeThresOne) return "col col-12 col-lg-6 mt-3"
      else if (arrSize > arrSizeThresOne && arrSize < arrSizeThresTwo) return "col col-12 col-lg-6 mt-3 ps-6"
    }
    if (sectionName === "Cell Configuration") {
      if (arrSize < arrSizeThresOne) return "col col-12 col-md-6 mt-3"
      else if (arrSize >= arrSizeThresOne && arrSize < arrSizeThresTwo) return "col col-12 col-lg-8 mt-3"
      else if (arrSize >= arrSizeThresTwo && arrSize < arrSizeThresThree) return "col col-12 col-xl-8 mt-3"
      else return "col col-12 mt-3"
    }
    if (sectionName === "Parameters") {
      if (arrSize < arrSizeThresOne) return "col col-12 col-md-5 mt-3 ps-6 pe-md-0"
      else if (arrSize >= arrSizeThresOne && arrSize < arrSizeThresTwo) return "col col-12 col-lg-3 mt-3 ps-6"
      else if (arrSize >= arrSizeThresTwo && arrSize < arrSizeThresThree) return "col col-12 col-xl-3 mt-3 ps-6"
      else return "col col-12 mt-3 ps-6"
    }
    if (sectionName === "ParameterFields") {
      if (arrSize < arrSizeThresOne) return "col"
      else if (arrSize >= arrSizeThresOne && arrSize < arrSizeThresTwo) return "col col-lg-12"
      else if (arrSize >= arrSizeThresTwo && arrSize < arrSizeThresThree) return "col col-xl-12"
      else return "col"
    }
  }

  // Read File
  const [fileName, setFileName] = useState<string>("") // The name of the file
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>("") // The contents of the file
  const [validatedFileInput, setValidatedFileInput] = useState<string[]>([]) // the file contents as array

  // Process the file into the fileName and fileContent states
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files[0].type == "text/plain") {

      const file = e.target.files[0];
      const reader = new FileReader();

      setTimeout(() => reader.readAsText(file, 'UTF-8'), 100)
      reader.onload = () => {
        setFileName(file.name)
        setFileContent(reader.result)
      };

      reader.onerror = () => {
        console.log('[ERROR]', reader.error)
      }
    } else {
      console.log("[ERROR] File is not plaintext.")
      return;
    }
  }

  // Validate the file and show a form error message if improper. 
  const validateReshapeFileInput = () => {
    if (fileContent != null) {

      if (typeof (fileContent) == "string" && fileContent.length > 0) {
        console.log("4", fileContent)
        const preValInput = fileContent.split(/\s+/)
        console.log("preValInput", preValInput)

        if (preValInput.length > 0 && Math.sqrt(preValInput.length) % 1 === 0) {

          if (preValInput.find((num) => parseInt(num) < 4)) {
            setValidatedFileInput(preValInput)

          } else {
            console.log("[ERROR] Contains invalid state. Only supports 1-bit and 2-bit cell configurations.")
            return;
          }
        } else {
          console.log("[ERROR] Array is not a perfect square. (length:" + preValInput.length + ").")
          return;
        }
      } else {
        console.log("[ERROR] File Contents are invalid string.")
        return;
      }
    } else {
      console.log("[ERROR] File Contents are null.")
      return;
    }
  }

  // Trigger update Form when file is valided.
  // This is required since, with useState, we can't update everything in the same function
  useEffect(() => {
    if (validatedFileInput.length != 0) {
      updateFormWithFile()
    }
  }, [validatedFileInput])

  // Update form with file..
  const updateFormWithFile = () => {
    console.log(fileName, "\n", fileContent, validatedFileInput)

    setArrSize(Math.sqrt(validatedFileInput.length));
    setValue("arrayDimension", Math.sqrt(validatedFileInput.length));

    // Delay is used to allow React-Hook-Form to properly register values and display values. I can't be bothered.
    // Maybe need to use another useEffect? 
    setTimeout(() => setValue("configuration", validatedFileInput), 100)
  }


  // Lookup Table Dropdown
  const [lookupTableAngle, setLookupTableAngle] = useState<number>(0) // Define angles
  const angleOptionsMaxLength = 45
  const angleOptionsIncrement = 5
  const arrayRange = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, index) => start + index * step
    );

  const angleOptions = arrayRange(-angleOptionsMaxLength, angleOptionsMaxLength, angleOptionsIncrement)

  // const angleOptions = Array.from({ length: 45 }, (_, i) => i + 5) // used with map() to draw the list of array dimension options for the user to select
  const lookupTableJSON = lookupTable

  // Trigger update Form when lookupTable button is pressed.
  // This is required since, with useState, we can't update everything in the same function
  useEffect(() => {
    if (validatedFileInput.length != 0) {
      updateFormWithFile()
    }
  }, [lookupTableAngle])



  return (

    <form id="configForm" name="configForm" onSubmit={handleSubmit(onSubmit)}>

      <div className="container">
        <div className="row flex">

          {/* INPUT DIRECTION LOOKUP TABLE FORM */}
          <div className={styleSectionGrids("Lookup Table")}>
            <div id="lookupTableForm" className="form-group">
              <div className="d-inline-flex gap-2 mb-3" style={{ minWidth: 300 + "px" }}>
                <div className="input-group">
                  <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#lookupTableInfo" aria-expanded="false" aria-controls="lookupTableInfo">
                    <InfoIcon />
                  </button>
                  <span className="input-group-text py-0" style={{ fontSize: "medium" }}><b>Table Lookup</b></span>
                  <select
                    className="form-select"
                    style={{ minWidth: 300 + "px" }}
                    id="lookupTableForm"
                    onChange={e => {
                      setLookupTableAngle(Number(e.target.value));
                    }}
                    defaultValue={lookupTableAngle}
                    disabled={formDisabled}>
                    {angleOptions.map((val) => (
                      <option value={val}>{val}&deg;</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary align-self-center"
                    id="lookupTableButton"
                    type="submit"
                    form="lookupTableForm"
                    value="Render"
                    onClick={() => {
                      console.log("here\n", lookupTableAngle)
                      // setValidatedFileInput()
                      console.log(lookupTableJSON[0])
                      // validateReshapeFileInput()
                    }}>
                    Render
                  </button>
                </div>

              </div>
              <div id="lookupTableInfo" className="collapse">
                <div className="card card-body py-2 mb-2 mx-2">
                  <p className="form-text mb-1">Input angle direction.</p>
                  <p className="form-text mb-1">Click 'Render' to display cell configuration for the angle.</p>
                </div>
              </div>

            </div>

          </div>

          {/* IMPORT CONFIG FILE FORM */}
          <div className={styleSectionGrids("File Upload")}>
            <div id="fileImportForm" className="form-group">
              <div className="d-inline-flex gap-2 mb-3">
                <div className="input-group">
                  <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#fileUploadInfo" aria-expanded="false" aria-controls="lookupTableInfo">
                    <InfoIcon />
                  </button>
                  <span className="input-group-text py-0" style={{ fontSize: "medium" }}><b>File Upload</b></span>
                  <input className="form-control" type="file" id="formFile" accept="text/plain" onChange={handleFileUpload} />
                  <button
                    className="btn btn-primary align-self-center"
                    id="importButton"
                    type="submit"
                    form="fileImportForm"
                    value="Upload"
                    onClick={() => {
                      console.log("here\n", fileContent)
                      validateReshapeFileInput()
                    }}>
                    Render
                  </button>
                </div>
              </div>
              <div id="fileUploadInfo" className="collapse">
                <div className="card card-body py-2 mb-2 mx-2">
                  <p className="form-text mb-1">Upload cell configuration file (.txt)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-12" style={{ marginBottom: "3rem", marginTop: "3rem" }} />

      </div>



      {/* SELECT ARRAY SIZE */}
      <div id="arrSizeForm" className="container form-group ">

        <div className="invalid-feedback">
          {errors.negVoltage?.message}
        </div>
        <div className="invalid-feedback">
          {errors.posVoltage?.message}
        </div>
        <div className="invalid-feedback">
          {errors.frequency?.message}
        </div>
        <div className="invalid-feedback">
          {errors.dutyCycle?.message}
        </div>



        <div className="input-group mb-3">
          <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#arraySizeInfo" aria-expanded="false" aria-controls="lookupTableInfo">
            <InfoIcon />
          </button>
          <span className="input-group-text py-0" style={{ fontSize: "medium" }}><b>Array Size</b></span>
          <select
            className="form-select"
            id="arrSizeForm"
            {...register("arrayDimension")}
            onChange={e => {
              setArrSize(Number(e.target.value));
            }}
            defaultValue={arrSize}
            disabled={formDisabled}>
            {dimOptions.map((val) => (
              <option value={val}>{val}x{val}</option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            id="arrSizeFormButton"
            type="button"
            form="arrSizeForm"
            value="Render"
            onClick={() => {
              console.log("here\n", arrSize)
            }}>
            Render
          </button>
        </div>
        <div id="arraySizeInfo" className="collapse">
          <div className="card card-body py-2 mb-2 mx-2">
            <p className="form-text mb-1">Select dimension of cell array.</p>
          </div>
        </div>
      </div>

      {/* TILED ARRAY */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <table key={cellArrayKey} id="cellArrayDisplay" className="table table-borderless" style={{ width: "min-content" }}>
          <thead>
            <tr>
              <th scope="col"></th>
              {dmuxDimArr.map((val) => (
                <th scope="col">
                  <button className="btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#columnConfig" style={{ width: "-webkit-fill-available" }}>
                    <b>{val}</b>
                  </button>
                  <div className="collapse card" id="columnConfig">
                    <div className="card-header">
                      <p className="float-start m-0">Column {val}</p>

                      <div className="form-check form-switch float-end m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          disabled={formDisabled}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log("hello", e.target.checked)
                            for (let i = 0; i < arrSize; i++) {
                              setValue(("configuration.cell_" + String(i * arrSize + val) + ".state") as any, e.target.value)
                            }
                          }}
                          style={{ "width": "3rem", "height": "1.25rem" }} />
                      </div>
                    </div>
                    <div className="card-body pb-0">

                      {/* VOLTAGE PEAK TO PEAK */}
                      <div className="input-group has-validation mb-3">
                        <span className="input-group-text py-0"><b>Vpp</b></span>
                        <input
                          className={`form-control form-control-sm ${errors.negVoltage ? "is-invalid" : ""}`}
                          id="negVoltageForm"
                          type="number"
                          step="any"
                          defaultValue={""}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            for (let i = 0; i < arrSize; i++) {
                              setValue(("configuration.cell_" + String(i * arrSize + val) + ".negVoltage") as any, e.target.value)
                            }
                          }}
                          disabled={formDisabled} />
                        <span className="input-group-text py-0">to</span>

                        <input
                          className={`form-control form-control-sm ${errors.posVoltage ? "is-invalid" : ""}`}
                          id="posVoltageForm"
                          type="number"
                          step="any"
                          defaultValue={""}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            for (let i = 0; i < arrSize; i++) {
                              setValue(("configuration.cell_" + String(i * arrSize + val) + ".posVoltage") as any, e.target.value)
                            }
                          }}
                          disabled={formDisabled} />
                        <span className="input-group-text py-0">V</span>

                      </div>

                      {/* FREQUENCY */}
                      <div className="input-group has-validation mb-3">
                        <span className="input-group-text py-0"><b>Frequency</b></span>

                        <input
                          className={`form-control form-control-sm ${errors.frequency ? "is-invalid" : ""}`}
                          id="frequencyForm"
                          type="number"
                          step="any"
                          defaultValue={""}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            for (let i = 0; i < arrSize; i++) {
                              setValue(("configuration.cell_" + String(i * arrSize + val) + ".frequency") as any, e.target.value)
                            }
                          }}
                          disabled={formDisabled} />
                        <span className="input-group-text py-0">Hz</span>
                      </div>

                      {/* DUTY CYCLE */}
                      <div className="input-group has-validation mb-3">
                        <span className="input-group-text py-0"><b>Duty Cycle</b></span>

                        <input
                          className={`form-control form-control-sm ${errors.dutyCycle ? "is-invalid" : ""}`}
                          id="dutyCycleForm"
                          type="number"
                          step="any"
                          defaultValue={""}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            for (let i = 0; i < arrSize; i++) {
                              setValue(("configuration.cell_" + String(i * arrSize + val) + ".dutyCycle") as any, e.target.value)
                            }
                          }}
                          disabled={formDisabled} />
                        <span className="input-group-text py-0">%</span>
                      </div>
                    </div>
                  </div>
                </th>

              ))}
            </tr>
          </thead>
          <tbody>
            {dmuxDimArr.map((rowVal) => (
              <tr>
                <th scope="row">{alphabet[rowVal]}</th>
                {dmuxDimArr.map((colVal) => (
                  <td>
                    <div className="col text-start">
                      <div className="card border-dark" style={{ minWidth: 250 + "px", maxWidth: 250 + "px" }}>
                        <div className="card-header">
                          <p className="float-start m-0"><b>#{String(rowVal * arrSize + colVal)} </b></p>
                          <div className="form-check form-switch float-end m-0">
                            <input
                              id={"cell_" + String(rowVal * arrSize + colVal)}
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              {...register(("configuration.cell_" + String(rowVal * arrSize + colVal) + ".state") as any)}
                              disabled={formDisabled}
                              style={{ "width": "3rem", "height": "1.25rem" }} />
                            <label className="form-check-label" htmlFor={"cell_" + String(rowVal * arrSize + colVal)}></label>
                          </div>
                        </div>
                        <div className="card-body pb-0">

                          {/* VOLTAGE PEAK TO PEAK */}
                          <div className="input-group has-validation mb-3">
                            <span className="input-group-text py-0"><b>Vpp</b></span>
                            <input
                              className={`form-control form-control-sm ${errors.negVoltage ? "is-invalid" : ""}`}
                              id="negVoltageForm"
                              type="number"
                              step="any"
                              defaultValue={-10}
                              {...register(("configuration.cell_" + String(rowVal * arrSize + colVal) + ".negVoltage") as any, voltageError)}
                              disabled={formDisabled} />
                            <span className="input-group-text py-0">to</span>

                            <input
                              className={`form-control form-control-sm ${errors.posVoltage ? "is-invalid" : ""}`}
                              id="posVoltageForm"
                              type="number"
                              step="any"
                              defaultValue={10}
                              {...register(("configuration.cell_" + String(rowVal * arrSize + colVal) + ".posVoltage") as any, voltageError)}
                              disabled={formDisabled} />
                            <span className="input-group-text py-0">V</span>

                          </div>

                          {/* FREQUENCY */}
                          <div className="input-group has-validation mb-3">
                            <span className="input-group-text py-0"><b>Frequency</b></span>

                            <input
                              className={`form-control form-control-sm  ${errors.frequency ? "is-invalid" : ""}`}
                              id="frequencyForm"
                              type="number"
                              step="any"
                              defaultValue={50}
                              {...register(("configuration.cell_" + String(rowVal * arrSize + colVal) + ".frequency") as any, defaultError)}
                              disabled={formDisabled} />
                            <span className="input-group-text py-0">Hz</span>

                          </div>

                          {/* DUTY CYCLE */}
                          <div className="input-group has-validation mb-3">
                            <span className="input-group-text py-0"><b>Duty Cycle</b></span>

                            <input
                              className={`form-control form-control-sm  ${errors.dutyCycle ? "is-invalid" : ""}`}
                              id="dutyCycleForm"
                              type="number"
                              step="any"
                              defaultValue={50}
                              {...register(("configuration.cell_" + String(rowVal * arrSize + colVal) + ".dutyCycle") as any, dutyCycleError)}
                              disabled={formDisabled} />
                            <span className="input-group-text py-0">%</span>

                          </div>

                        </div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default ConfigurationForm;
