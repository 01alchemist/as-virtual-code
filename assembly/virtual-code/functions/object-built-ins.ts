import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";
import { jsonToBoolean } from "./utils";

export const $exists = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const key = operands[0].toString();
  const state = operands.length == 2 ? jsonToBoolean(operands[1]) : true;
  if (key.startsWith("store.")) {
    return new JSON.Bool(store.exists(key) == state);
  }
  return new JSON.Bool(context.exists(key) == state);
};

export const $keys = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const operand = operands[0];
  if (!operand.isObj) {
    throw new Error(`Invalid operand passed to $keys:[${operand.toString()}]`);
  }
  const keys = (<JSON.Obj>operand).keys;
  let result = new JSON.Arr();
  for (let i: i32 = 0; i < keys.length; i++) {
    result.push(new JSON.Str(keys[i]));
  }
  return result;
};

// export const objectBuiltIns = {
//   $exists,
//   $keys,
// };
// export default objectBuiltIns;

// export type ObjectBuiltIns = typeof objectBuiltIns;
// export type ObjectBuiltIn = keyof ObjectBuiltIns;
// export type ObjectBuiltInCode = {
//   [K in ObjectBuiltIn]?: Parameters<ObjectBuiltIns[K]>[0];
// };
