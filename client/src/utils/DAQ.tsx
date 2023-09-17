export type DAQInputs = {
  timestamp: string; // generated on submit
  negVoltage: number;
  posVoltage: number;
  frequency: number;
  dutyCycle: number;
  defaultDuration: number;
  arrSize: number;
  dmuxOutputNum: {
    "0": number;
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
    "6": number;
    "7": number;
    "8": number;
    "9": number;
    "10": number;
    "11": number;
    "12": number;
    "13": number;
    "14": number;
    "15": number;
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
  "AA",
  "BB",
  "CC",
  "DD",
  "EE",
  "FF",
  "GG",
  "HH",
  "II",
  "JJ",
  "KK",
  "LL",
  "MM",
  "NN",
  "OO",
  "PP",
  "QQ",
  "RR",
  "SS",
  "TT",
  "UU",
  "VV",
  "WW",
  "XX",
  "YY",
  "ZZ",
];
