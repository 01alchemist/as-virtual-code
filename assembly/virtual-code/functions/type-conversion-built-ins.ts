import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";
import { jsonToInt32 } from "./utils";

export const $toDouble = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => new JSON.Num(parseFloat(operands[0].toString()));

export const $toInt = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  let int: number;
  if (operands.length == 2) {
    const radix = jsonToInt32(operands[1]);
    int = parseInt(operands[0].toString(), radix);
  } else {
    int = parseInt(operands[0].toString());
  }
  return new JSON.Num(int);
};

// export const typeConversionBuiltIns = {
//   $toDouble,
//   $toInt,
// };
// export default typeConversionBuiltIns;

// export type TypeConversionBuiltIns = typeof typeConversionBuiltIns;
// export type TypeConversionBuiltInKeys = keyof TypeConversionBuiltIns;
// export type TypeConversionBuiltInCode = {
//   [K in TypeConversionBuiltInKeys]?: Parameters<TypeConversionBuiltIns[K]>[0];
// };
