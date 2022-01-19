const fs = require("fs");
const loader = require("@assemblyscript/loader");
const debug = true;
const __debug = new WebAssembly.Global({ value: "i32", mutable: true }, debug);
const imports = {
  index: {
    __debug: __debug,
    log: (val) => console.log(mod.__getString(val)),
  },
  "virtual-code": {
    log: (msg) => console.log(mod.__getString(msg)),
  },
};
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/untouched.wasm"),
  imports
);
const mod = wasmModule.exports;
// console.log(mod);
module.exports = mod;

function jsonRef(data) {
  const str = JSON.stringify(data);
  const buf = mod.__newString(str);
  const ref = mod.parseJSON(buf);
  return ref;
}

console.time("Total execution time");
// Calculation Data
/* const calcJson = {
  id: 1,
  version: 2,
  globals: [
    {
      name: "roundFactor",
      mutable: false,
      value: 2,
    },
    {
      name: "paymentMethodMin",
      mutable: false,
      value: 0,
    },
    {
      name: "tax",
      mutable: false,
      value: 1.19,
    },
  ],
  functions: [
    {
      name: "$calcAmountBeforeNetAmount",
      locals: ["$paymentMethodFactor", "$paymentMethodDivisor"],
      body: {
        $store: [
          "amountBeforeNetAmount",
          {
            $max: [
              {
                $round: [
                  {
                    $divide: [
                      {
                        $multiply: [
                          "$store.result",
                          "$locals.paymentMethodFactor",
                        ],
                      },
                      "$locals.paymentMethodDivisor",
                    ],
                  },
                  "$globals.roundFactor",
                ],
              },
              "$globals.paymentMethodMin",
            ],
          },
        ],
      },
    },
    {
      name: "$calcNetAmount",
      body: {
        $store: [
          "netAmount",
          {
            $round: [
              {
                $divide: ["$store.result", "$locals.factor1"],
              },
              "$globals.roundFactor",
            ],
          },
        ],
      },
    },
    {
      name: "$calcGrossAmount",
      body: {
        $store: [
          "grossAmount",
          {
            $round: [
              {
                $multiply: [
                  "$store.netAmount",
                  "$globals.tax",
                  "$locals.paymentMethodFactor",
                  "$locals.paymentMethodDivisor",
                ],
              },
              "$globals.roundFactor",
            ],
          },
        ],
      },
    },
    {
      name: "$calcContractExpiration",
      body: {
        $store: [
          "contractExpiration",
          {
            "$date.format": [
              {
                "$date.add": [
                  "$questions._basic_questions_insurance_begin",
                  "$locals.factor1",
                  "year",
                ],
              },
              "YYYY-MM-DD",
            ],
          },
        ],
      },
    },
  ],
  steps: [
    {
      id: 1,
      condition: {
        conditionId: -1,
        code: {
          $gt: ["$questions._transport_works_traffic_vehicle_cargo", 25000],
        },
        version: 3,
      },
      locals: [],
      code: {
        $reject: [],
      },
    },
    {
      id: 2,
      locals: [
        {
          name: "factor1",
          value: 0,
        },
      ],
      code: {
        $store: [
          "sumInsuredGeneral",
          {
            $max: [
              "$questions._transport_works_traffic_cargo",
              "$locals.factor1",
            ],
          },
        ],
      },
    },
    {
      id: 3,
      locals: [
        { name: "factor1", value: 15 },
        { name: "factor2", value: 1000 },
        { name: "factor3", value: 250 },
      ],
      code: {
        $store: [
          "result",
          {
            $max: [
              {
                $divide: [
                  {
                    $multiply: [
                      "$questions._transport_works_traffic_count_vehicle",
                      "$questions._transport_works_traffic_vehicle_cargo",
                      "$locals.factor1",
                    ],
                  },
                  "$locals.factor2",
                ],
              },
              "$locals.factor3",
            ],
          },
        ],
      },
    },
    {
      id: 4,
      locals: [
        { name: "paymentMethodFactor", value: 1 },
        { name: "paymentMethodDivisor", value: 1 },
      ],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "yearly"],
        },
        version: 3,
      },
      code: {
        $calcAmountBeforeNetAmount: [],
      },
    },
    {
      id: 5,
      locals: [
        { name: "paymentMethodFactor", value: 1.03 },
        { name: "paymentMethodDivisor", value: 2 },
      ],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "half_yearly"],
        },
        version: 3,
      },
      code: {
        $calcAmountBeforeNetAmount: [],
      },
    },
    {
      id: 6,
      locals: [
        { name: "paymentMethodFactor", value: 1.05 },
        { name: "paymentMethodDivisor", value: 4 },
      ],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "quarterly"],
        },
        version: 3,
      },
      code: {
        $calcAmountBeforeNetAmount: [],
      },
    },
    {
      id: 7,
      locals: [{ name: "factor1", value: 1 }],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "yearly"],
        },
        version: 3,
      },
      code: {
        $calcNetAmount: [],
      },
    },
    {
      id: 8,
      locals: [{ name: "factor1", value: 1.03 }],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "half_yearly"],
        },
        version: 3,
      },
      code: {
        $calcNetAmount: [],
      },
    },
    {
      id: 9,
      locals: [{ name: "factor1", value: 1.05 }],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "quarterly"],
        },
        version: 3,
      },
      code: {
        $calcNetAmount: [],
      },
    },
    {
      id: 10,
      locals: [
        { name: "paymentMethodFactor", value: 1 },
        { name: "paymentMethodDivisor", value: 1 },
      ],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "yearly"],
        },
        version: 3,
      },
      code: {
        $calcGrossAmount: [],
      },
    },
    {
      id: 11,
      locals: [
        { name: "paymentMethodFactor", value: 1.03 },
        { name: "paymentMethodDivisor", value: 2 },
      ],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "half_yearly"],
        },
        version: 3,
      },
      code: {
        $calcGrossAmount: [],
      },
    },
    {
      id: 12,
      locals: [
        { name: "paymentMethodFactor", value: 1.05 },
        { name: "paymentMethodDivisor", value: 4 },
      ],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.paymentMethod", "quarterly"],
        },
        version: 3,
      },
      code: {
        $calcGrossAmount: [],
      },
    },
    {
      id: 13,
      code: {
        $store: [
          "taxAmount",
          {
            $round: [
              {
                $multiply: [
                  "$store.grossAmount",
                  {
                    $subtract: ["$globals.tax", 1],
                  },
                ],
              },
              "$globals.roundFactor",
            ],
          },
        ],
      },
    },
    {
      id: 14,
      locals: [{ name: "factor1", value: 1 }],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.duration", "1", false],
        },
        version: 3,
      },
      code: {
        $calcContractExpiration: [],
      },
    },
    {
      id: 15,
      locals: [{ name: "factor1", value: 3 }],
      condition: {
        conditionId: -1,
        code: {
          $eq: ["$rate.duration", "3", false],
        },
        version: 3,
      },
      code: {
        $calcContractExpiration: [],
      },
    },
    {
      id: 16,
      code: {
        $store: [
          "totalNetAmount",
          {
            $round: ["$store.amountBeforeNetAmount", "$globals.roundFactor"],
          },
        ],
      },
    },
    {
      id: 17,
      code: {
        $store: [
          "netAmountYear",
          {
            $round: [
              {
                $subtract: ["$store.grossAmount", "$store.taxAmount"],
              },
              "$globals.roundFactor",
            ],
          },
        ],
      },
    },
    {
      id: 18,
      code: {
        $store: [
          "totalAmount",
          {
            $round: [
              {
                $multiply: ["$store.amountBeforeNetAmount", "$globals.tax"],
              },
              "$globals.roundFactor",
            ],
          },
        ],
      },
    },
  ],
}; */
const calcDataRef = jsonRef({
  "$date.diff": [
    // { $date: ["Mon Sep 02 2019 16:22:30"] },
    // { $date: ["Mon Oct 10 2017 04:38:24"] },
    "2019-01-01T14:22:30.000",
    "2019-01-01T14:22:30.000",
    "months",
    false,
  ],
});
// Context Data
const context = {
  questions: {
    _basic_questions_insurance_begin: "2022-01-13",
    _transport_works_traffic_cargo: 1000000,
    _transport_works_traffic_count_vehicle: 100,
    _transport_works_traffic_vehicle_cargo: 10,
  },
  rate: {
    duration: "1",
    paymentMethod: "yearly",
  },
};
const contextDataRef = jsonRef(context);
// Store Data
const store = {};
const storeDataRef = jsonRef(store);
// Calculate
const result = mod.evaluateCode(calcDataRef, contextDataRef, storeDataRef);
const resultStrRef = mod.resultToString(result);
console.timeEnd("Total execution time");
const resultStr = mod.__getString(resultStrRef);
// console.log(resultStr);
const jsonResult = JSON.parse(resultStr);
console.log("result => ", jsonResult);
// console.log(new Date(parseInt(jsonResult.result)));
// console.log(new Date(2022));
