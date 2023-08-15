export type DAQInputs = {
  timestamp: string; // generated on submit
  negVoltage: number;
  posVoltage: number;
  frequency: number;
  dutyCycle: number;
  defaultDuration: number;
  arrSize: number;
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

export const defaultActuatedCells = {
  "0": false,
  "1": false,
  "2": false,
  "3": false,
  "4": false,
  "5": false,
  "6": false,
  "7": false,
  "8": false,
  "9": false,
  "10": false,
  "11": false,
  "12": false,
  "13": false,
  "14": false,
  "15": false,
};

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
