type DAQInputs = {
  timestamp: string; // generated on submit
  negVoltage: number;
  posVoltage: number;
  frequency: number;
  dutyCycle: number;
  defaultDuration: number;
  dmuxOutputNum: {
    "0": boolean;
    "1": boolean;
    "2": boolean;
    "3": boolean;
    "4": boolean;
    "5": boolean;
    "6": boolean;
    "7": boolean;
    "8": boolean;
    "9": boolean;
    "10": boolean;
    "11": boolean;
    "12": boolean;
    "13": boolean;
    "14": boolean;
    "15": boolean;
  }; // from cell array form
};
export default DAQInputs