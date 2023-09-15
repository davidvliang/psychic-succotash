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

  // Init form input using RHF
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
    // console.log("form_data", form_data);
  };

  // Reset form values when reset button is pressed
  useEffect(() => {
    reset();
    setArrSize(4);
  }, [resetButton]);

  // Input Validation 
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

  // Adjust size of array
  const [arrSize, setArrSize] = useState(4); // set dimension for array
  const dmuxDimArr = [...Array(arrSize).keys()]; // used to draw array
  const dimOptions = Array.from({length:16}, (_,i) => i+1) // list of options for array dimension
  const defaultArr = Array.from({length:arrSize*arrSize}, (_) => false) // reset array to default values when changing dimensions

  return (
    <form id="configForm" name="configForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="row justify-content-start">
        <div className={arrSize < 6 ? "col col-12 col-md-5 mt-3 px-md-0" : "col col-12 mt-3"}>
          <h1>Cell Configuration</h1>
          <div id="arrSizeForm" className="form-group">
            <div className="input-group has-validation">
              <select 
                  className="form-select my-3" 
                  id="arrSizeForm" {...register("arrSize")} 
                  onChange={e => {
                    setArrSize(Number(e.target.value)); 
                    setValue('dmuxOutputNum', defaultArr as any)
                  }} 
                  defaultValue={arrSize}
                  disabled={formDisabled}>
                {dimOptions.map((val) => (
                  <option value={val}>{val}x{val}</option>
                ))}
              </select>
            </div>
          </div>
          <table className="table table-borderless">
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
                      <input
                        type="checkbox"
                        className="btn btn-check"
                        id={String(rowVal * arrSize + colVal)}
                        {...register(
                          ("dmuxOutputNum." +
                            String(rowVal * arrSize + colVal)) as any
                        )}
                        disabled={formDisabled}
                      />
                      <label
                        className={
                          actuatedCells[
                            String(
                              rowVal * arrSize + colVal
                            ) as keyof typeof actuatedCells
                          ]
                            ? "btn cell btn-outline-success"
                            : "btn cell btn-outline-primary"
                        }
                        htmlFor={String(rowVal * arrSize + colVal)}
                      >
                        {rowVal * arrSize + colVal}
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="form-text ps-3">Select cells to activate.</p>
        </div>

        <div className={arrSize < 6 ? "col col-12 col-md-6 mt-3 offset-md-1 ps-6 pe-md-0" : "col col-12 mt-3 ps-6"}>
          <h1>Parameters</h1>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="negVoltageForm">
                  Negative Voltage:
                </label>
                <div className="input-group has-validation mb-3">
                  <input
                    className={`form-control form-control-sm ${
                      errors.negVoltage ? "is-invalid" : ""
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

            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="posVoltageForm">
                  Positive Voltage:
                </label>
                <div className="input-group has-validation mb-3">
                  <input
                    className={`form-control form-control-sm ${
                      errors.posVoltage ? "is-invalid" : ""
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
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="frequencyForm">
                  Frequency:
                </label>
                <div className="input-group has-validation">
                  <input
                    className={`form-control form-control-sm  ${
                      errors.frequency ? "is-invalid" : ""
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
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="dutyCycleForm">
                  Duty Cycle:
                </label>
                <div className="input-group has-validation mb-3">
                  <input
                    className={`form-control form-control-sm  ${
                      errors.dutyCycle ? "is-invalid" : ""
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
                  className={`form-control form-control-sm ${
                    errors.defaultDuration ? "is-invalid" : ""
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
          <p className="form-text">
            Voltages must be between -10 and 10. <br />
            Duty Cycle must be an integer percentage. <br />
            Frequency and Duration must be integers.
            <br />
          </p>
        </div>
      </div>
    </form>
  );
};

export default ConfigurationForm;
