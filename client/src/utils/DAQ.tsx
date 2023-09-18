export type DAQInputs = {
  timestamp: string; // generated on submit
  negVoltage: number;
  posVoltage: number;
  frequency: number;
  dutyCycle: number;
  defaultDuration: number;
  arrSize: number;
  dmuxOutputNum: string[];
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
