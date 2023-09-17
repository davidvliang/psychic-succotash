import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { DAQInputs, alphabet } from "../utils/DAQ";
import getTS from "../utils/getTS";

const ConfigurationForm = ({
  resetButton,
  handleConfigureData,
  formDisabled,
  actuatedCells,
}: {
  resetButton: boolean;
  handleConfigureData: (data: object) => void;
  formDisabled: boolean;
  actuatedCells: object;
}) => {

  // Initialize form input using React-Hook-Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DAQInputs>();

  // Collect form data as JSON string upon submit
  const onSubmit: SubmitHandler<DAQInputs> = (data) => {
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
  const [cellArrayKey, setCellArrayKey] = useState<number>(69420); // set dimension for array based on user input, default is 4x4
  const [dmuxDimArr, setDmuxDimArr] = useState([...Array(arrSize).keys()]);
  // const dmuxDimArr = [...Array(arrSize).keys()]; // used with map() to draw cell array
  const dimOptions = Array.from({ length: 16 }, (_, i) => i + 1) // used with map() to draw the list of array dimension options for the user to select
  const defaultArr = Array.from({ length: arrSize * arrSize }, (_) => false) // reset array to default values when changing dimensions

  // When user changes the array size
  useEffect(() => { 
    // setValue('dmuxOutputNum', defaultArr as any); // reset the dimensions of 
    setDmuxDimArr([...Array(arrSize).keys()]); // update dmuxDimArr, which is used to draw the cell array 
    setCellArrayKey(Math.random()) // cycle to a new key for #cellArrayDisplay, which rerenders the element
  }, [arrSize]);

  // Set Styling for Cells based on Actuation (highlight green) and FormDisabled (submit button pressed)
  const styleCell = (elementID:string, _rowVal:number, _colVal:number) => {
    let cellElement = document.getElementById(elementID) as HTMLInputElement // grab input element by ID
    let actuateClassName = actuatedCells[String(_rowVal * arrSize + _colVal) as keyof typeof actuatedCells] ? "btn-success" : "" // highlight green when cell is actuated by python script
    let formDisabledClassName = formDisabled && !cellElement.checked ? "opacity-0" : "" // when form is disabled (when submit button pressed), hide the states that aren't checked
    return " " + formDisabledClassName + " " + actuateClassName + " " // return these conditional classNames
  }

  // Handle File Import Function
  const handleFileSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0].type != "text/plain") return;
    console.log(e.target.files[0])
    // setFileText(fs.readFileSync( 'utf-8');)
    // console.log(e.target.files.item)
  }

  return (
    
    <form id="configForm" name="configForm" onSubmit={handleSubmit(onSubmit)}>

      {/* IMPORT CONFIG FILE FORM */}
      <div className="row justify-content-start">
        <div className={arrSize < 6 ? "col col-12 col-md-5 px-md-0 mt-3" : "col col-12 mt-3 ps-6"}>
          <div className="d-inline-flex gap-2">
            <h2>File Upload</h2>
            <button className="btn btn-secondary align-self-center py-0 px-2 mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#fileUploadInfo" aria-expanded="false" aria-controls="cellConfigurationInfo">
              ?
            </button>
          </div>
          <div id="fileUploadInfo" className="collapse">
            <div className="card card-body py-2 mb-2 mx-2">
              <p className="form-text mb-1">Upload cell configuration file (.txt)</p>
            </div>
          </div>
          <div id="fileImportForm" className="form-group">
            <div className="d-inline-flex gap-2">
              <div className="input-group has-validation">
                <div className="mb-3">
                  <input className="form-control mt-3" type="file" id="formFile" onChange={handleFileSubmit} />
                </div>
              </div>
              <button
                className="btn btn-primary ms-1 my-1 py-1 align-self-center"
                id="importButton"
                type="submit"
                form="fileImportForm"
                value="Upload"
                onClick={() => {
                  handleFileSubmit
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-8" />

      <div className="row justify-content-start">

        {/* CELL CONFIGURATION INPUT FORM */}
        <div className={arrSize < 6 ? "col col-12 col-md-5 mt-3 px-md-0" : "col col-12 mt-3"}>
          <div className="d-inline-flex gap-2">
            <h2>Cell Configuration</h2>
            <button className="btn btn-secondary align-self-center py-0 px-2 mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#cellConfigurationInfo">
              ?
            </button>
          </div>

          <div id="cellConfigurationInfo" className="collapse">
            <div className="card card-body py-2 mb-2 mx-2">
              <p className="form-text mb-1">1. Use dropdown to select array size.</p>
              <p className="form-text mb-1">2. Select which array cells to actuate.</p>
            </div>
          </div>

          {/* SELECT ARRAY SIZE */}
          <div id="arrSizeForm" className="form-group">
            <div className="input-group has-validation">
              <select
                className="form-select my-3"
                id="arrSizeForm" {...register("arrSize")}
                onChange={e => {
                  setArrSize(Number(e.target.value));
                }}
                defaultValue={arrSize}
                disabled={formDisabled}>
                {dimOptions.map((val) => (
                  <option value={val}>{val}x{val}</option>
                ))}
              </select>
            </div>
          </div>

          {/* DISPLAY CELL ARRAY */}
          <table key={cellArrayKey} id="cellArrayDisplay" className="table table-borderless">
            <thead>
              <tr>
                <th scope="col"></th>
                {dmuxDimArr.map((val) => (
                  <th scope="col">{val}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dmuxDimArr.map((rowVal) => (
                <tr>
                  <th scope="row">{alphabet[rowVal]}</th>
                  {dmuxDimArr.map((colVal) => (
                    <td>
                      {/* CYCLESTATE (https://stackoverflow.com/questions/33455204/quad-state-checkbox) */}
                      <fieldset className="cyclestate" id={"cell_" + String(rowVal * arrSize + colVal)}>
                        <input id={"s0_cell_" + String(rowVal * arrSize + colVal)} className="form-check-input btn-check" type="radio" {...register(("dmuxOutputNum." + String(rowVal * arrSize + colVal)) as any)} value="0" disabled={formDisabled} defaultChecked />
                        <label className={"form-check-label btn cell p-0"+styleCell("s0_cell_" + String(rowVal * arrSize + colVal), rowVal, colVal) } htmlFor={"s0_cell_" + String(rowVal * arrSize + colVal)}>0&deg;</label>
                        <input id={"s1_cell_" + String(rowVal * arrSize + colVal)} className="form-check-input btn-check" type="radio" {...register(("dmuxOutputNum." + String(rowVal * arrSize + colVal)) as any)} value="1" disabled={formDisabled} />
                        <label className={"form-check-label btn btn-primary cell p-0"+styleCell("s1_cell_" + String(rowVal * arrSize + colVal), rowVal, colVal) } htmlFor={"s1_cell_" + String(rowVal * arrSize + colVal)}>90&deg;</label>
                        <input id={"s2_cell_" + String(rowVal * arrSize + colVal)} className="form-check-input btn-check" type="radio" {...register(("dmuxOutputNum." + String(rowVal * arrSize + colVal)) as any)} value="2" disabled={formDisabled} />
                        <label className={"form-check-label btn btn-primary cell p-0"+styleCell("s2_cell_" + String(rowVal * arrSize + colVal), rowVal, colVal) } htmlFor={"s2_cell_" + String(rowVal * arrSize + colVal)}>180&deg;</label>
                        <input id={"s3_cell_" + String(rowVal * arrSize + colVal)} className="form-check-input btn-check" type="radio" {...register(("dmuxOutputNum." + String(rowVal * arrSize + colVal)) as any)} value="3" disabled={formDisabled} />
                        <label className={"form-check-label btn btn-primary cell p-0"+styleCell("s3_cell_" + String(rowVal * arrSize + colVal), rowVal, colVal) } htmlFor={"s3_cell_" + String(rowVal * arrSize + colVal)}>270&deg;</label>
                      </fieldset>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* PARAMETERS INPUT FORM */}
        <div className={arrSize < 6 ? "col col-12 col-md-6 mt-3 offset-md-1 ps-6 pe-md-0" : "col col-12 mt-3 ps-6"}>
          <div className="d-inline-flex gap-2">
            <h2>Parameters</h2>
            <button className="btn btn-secondary align-self-center py-0 px-2 mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#parametersInfo">
              ?
            </button>
          </div>

          <div className="row">
            <div id="parametersInfo" className="collapse float-start">
              <div className="card card-body py-2 mb-2 mx-2">
                <p className="form-text mb-1">Voltages must be between -10 and 10.</p>
                <p className="form-text mb-1">Duty Cycle must be an integer percentage.  </p>
                <p className="form-text mb-1">Frequency and Duration must be integers.</p>
              </div>
            </div>

            {/* NEGATIVE VOLTAGE */}
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="negVoltageForm">
                  Negative Voltage:
                </label>
                <div className="input-group has-validation mb-3">
                  <input
                    className={`form-control form-control-sm ${errors.negVoltage ? "is-invalid" : ""
                      }`}
                    id="negVoltageForm"
                    type="number"
                    step="any"
                    defaultValue={-10}
                    {...register("negVoltage", voltageError)}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon1">
                    V
                  </span>
                  {/* <p>{errors.negVoltage?.message}</p> */}
                  <div className="invalid-feedback">
                    {errors.negVoltage?.message}
                  </div>
                </div>
              </div>
            </div>

            {/* POSITIVE VOLTAGE */}
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="posVoltageForm">
                  Positive Voltage:
                </label>
                <div className="input-group has-validation mb-3">
                  <input
                    className={`form-control form-control-sm ${errors.posVoltage ? "is-invalid" : ""
                      }`}
                    id="posVoltageForm"
                    type="number"
                    step="any"
                    defaultValue={10}
                    {...register("posVoltage", voltageError)}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon2">
                    V
                  </span>
                  <div className="invalid-feedback">
                    {errors.posVoltage?.message}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">

            {/* FREQUENCY */}
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="frequencyForm">
                  Frequency:
                </label>
                <div className="input-group has-validation">
                  <input
                    className={`form-control form-control-sm  ${errors.frequency ? "is-invalid" : ""
                      }`}
                    id="frequencyForm"
                    type="number"
                    step="any"
                    // inputmode="decimal"
                    // pattern="[0-9]*"
                    // placeholder="50"
                    defaultValue={50}
                    {...register("frequency", defaultError)}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon2">
                    Hz
                  </span>
                  <div className="invalid-feedback">
                    {errors.frequency?.message}
                  </div>
                </div>
              </div>
            </div>

            {/* DUTY CYCLE */}
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="dutyCycleForm">
                  Duty Cycle:
                </label>
                <div className="input-group has-validation mb-3">
                  <input
                    className={`form-control form-control-sm  ${errors.dutyCycle ? "is-invalid" : ""
                      }`}
                    id="dutyCycleForm"
                    type="number"
                    step="any"
                    defaultValue={50}
                    {...register("dutyCycle", dutyCycleError)}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon1">
                    %
                  </span>
                  <div className="invalid-feedback">
                    {errors.dutyCycle?.message}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DURATION */}
          <div className="row">
            <div className="form-group">
              <label
                className="col-form-label-sm"
                htmlFor="defaultDurationForm"
              >
                Duration:
              </label>
              <div className="input-group has-validation mb-3">
                <input
                  className={`form-control form-control-sm ${errors.defaultDuration ? "is-invalid" : ""
                    }`}
                  id="defaultDurationForm"
                  type="number"
                  step="any"
                  defaultValue={10}
                  {...register("defaultDuration", defaultError)}
                  disabled={formDisabled}
                />
                <span className="input-group-text" id="basic-addon1">
                  seconds
                </span>
                <div className="invalid-feedback">
                  {errors.defaultDuration?.message}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
};

export default ConfigurationForm;
