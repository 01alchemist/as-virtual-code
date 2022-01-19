import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { evaluateCode, EvaluationContext, EvaluationStore, log } from "..";

export const $select = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  let result: Value = new JSON.Null();
  for (let i: i32 = 0; i < operands.length; i++) {
    const operand = operands[i];
    const $this = evaluateCode(operand, context, store).return;
    if (!$this.isNull) {
      result = $this;
      return result;
    }
  }
  return result;
};

export const $selectIf = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const condition = operands[operands.length - 1];

  let result: Value = new JSON.Null();

  for (let i: i32 = 0; i < operands.length - 1; i++) {
    const operand = operands[i];
    const $this = evaluateCode(operand, context, store).return;
    store.set("this", $this);
    const conditionResult = evaluateCode(condition, context, store);
    const conditionValue = conditionResult.return;
    let conditionBool: bool = false;
    if (conditionValue.isBool) {
      conditionBool = (<JSON.Bool>conditionValue).valueOf();
    } else {
      const str = conditionValue.toString();
      conditionBool =
        str != "null" && str != "" && str != "0" && str != "false";
    }

    if (conditionBool) {
      result = $this;
      return result;
    }
  }
  return result;
};

export const $evaluateIf = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  let result: Value = new JSON.Null();

  for (let i: i32 = 0; i < operands.length; i++) {
    const arr = (<JSON.Arr>operands[i]).valueOf();
    const code = arr[0];
    const condition = arr[1];
    const conditionResult = evaluateCode(condition, context, store);
    const conditionValue = conditionResult.return;
    let conditionBool: bool = false;
    if (conditionValue.isBool) {
      conditionBool = (<JSON.Bool>conditionValue).valueOf();
    } else {
      const str = conditionValue.toString();
      conditionBool = str != "" && str != "0" && str != "false";
    }
    if (conditionBool) {
      return evaluateCode(code, context, store).return;
    }
  }
  return result;
};

// export const conditionalOperators = {
//   $selectDefined,
//   $select,
//   $selectIf,
//   $evaluateIf,
// };
// export const conditionalOperatorNames = Object.keys(conditionalOperators);
// export default conditionalOperators;

// export type ConditionalOperators = typeof conditionalOperators;
// export type ConditionalOperatorKeys = keyof ConditionalOperators;
// export type ConditionalCode = {
//   [K in ConditionalOperatorKeys]?: (
//     | Parameters<ConditionalOperators[K]>[0][number]
//     | string)[]
// };
