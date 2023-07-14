import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import DAQInputs from "../utils/DAQ";
import getTS from "../utils/getTS";

const ConfigurationForm = ({
  resetButton,
  handleConfigureData,
  formDisabled,
}: {
  resetButton: boolean;
  handleConfigureData: (data: object) => void;
  formDisabled: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DAQInputs>();
  const onSubmit: SubmitHandler<DAQInputs> = (data) => {
    let eafis = data; // eafis stands for eafis
    eafis["timestamp"] = getTS();
    handleConfigureData(eafis);
  };
  useEffect(() => {
    reset();
  }, [resetButton]);

  const requiredError = { required: "Cannot be blank." };
  const maxValueError = {
    max: { value: 10, message: "Voltage must be below 10V." },
  };
  const minValueError = {
    max: { value: -10, message: "Voltage must be above -10V." },
  };

  return (
    <form id="configForm" name="configForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="row justify-content-start">
        <div className="col col-12 col-md-5 mt-3 px-md-0">
          <h1>Cell Configuration</h1>
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">0</th>
                <th scope="col">1</th>
                <th scope="col">2</th>
                <th scope="col">3</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th scope="row">A</th>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="0"
                    {...register("dmuxOutputNum.0")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="0">
                    0
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="1"
                    {...register("dmuxOutputNum.1")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="1">
                    1
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="2"
                    {...register("dmuxOutputNum.2")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="2">
                    2
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="3"
                    {...register("dmuxOutputNum.3")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="3">
                    3
                  </label>
                </td>
              </tr>
              <tr>
                <th scope="row">B</th>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="4"
                    {...register("dmuxOutputNum.4")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="4">
                    4
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="5"
                    {...register("dmuxOutputNum.5")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="5">
                    5
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="6"
                    {...register("dmuxOutputNum.6")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="6">
                    6
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="7"
                    {...register("dmuxOutputNum.7")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="7">
                    7
                  </label>
                </td>
              </tr>
              <tr>
                <th scope="row">C</th>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="8"
                    {...register("dmuxOutputNum.8")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="8">
                    8
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="9"
                    {...register("dmuxOutputNum.9")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="9">
                    9
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="10"
                    {...register("dmuxOutputNum.10")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="10">
                    10
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="11"
                    {...register("dmuxOutputNum.11")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="11">
                    11
                  </label>
                </td>
              </tr>
              <tr>
                <th scope="row">D</th>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="12"
                    {...register("dmuxOutputNum.12")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="12">
                    12
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    // defaultValue={false}
                    id="13"
                    {...register("dmuxOutputNum.13")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="13">
                    13
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="14"
                    {...register("dmuxOutputNum.14")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="14">
                    14
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="btn btn-check"
                    id="15"
                    {...register("dmuxOutputNum.15")}
                    disabled={formDisabled}
                  />
                  <label className="btn btn-outline-primary cell" htmlFor="15">
                    15
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="form-text ps-3">Select cells to configure.</p>
        </div>
        <div className="col col-12 col-md-6 mt-3 offset-md-1 ps-6 pe-md-0">
          <h1>Parameters</h1>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="negVoltageForm">
                  Negative Voltage:
                </label>
                <div className="input-group mb-3">
                  <input
                    className="form-control form-control-sm"
                    id="negVoltageForm"
                    type="number"
                    step="any"
                    placeholder="-10"
                    defaultValue={-10}
                    {...register("negVoltage", requiredError)}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon1">
                    V
                  </span>
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
                <div className="input-group mb-3">
                  <input
                    className="form-control form-control-sm"
                    id="posVoltageForm"
                    type="number"
                    step="any"
                    placeholder="10"
                    defaultValue={10}
                    {...register("posVoltage")}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon1">
                    V
                  </span>
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
                <div className="input-group">
                  <input
                    className="form-control form-control-sm"
                    id="frequencyForm"
                    type="number"
                    // inputmode="decimal"
                    // pattern="[0-9]*"
                    placeholder="50"
                    defaultValue={50}
                    {...register("frequency")}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon1">
                    Hz
                  </span>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label className="col-form-label-sm" htmlFor="dutyCycleForm">
                  Duty Cycle:
                </label>
                <div className="input-group mb-3">
                  <input
                    className="form-control form-control-sm"
                    id="dutyCycleForm"
                    type="number"
                    placeholder="50"
                    defaultValue={50}
                    {...register("dutyCycle")}
                    disabled={formDisabled}
                  />
                  <span className="input-group-text" id="basic-addon1">
                    %
                  </span>
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
              <div className="input-group mb-3">
                <input
                  className="form-control form-control-sm"
                  id="defaultDurationForm"
                  type="number"
                  placeholder="60"
                  defaultValue={10}
                  {...register("defaultDuration")}
                  disabled={formDisabled}
                />
                <span className="input-group-text" id="basic-addon1">
                  seconds
                </span>
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
