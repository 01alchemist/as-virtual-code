import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";

export const $store = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  store.set(operands[0].toString(), operands[1]);
  return operands[1];
};

// export const storeOperators = {
//   $store,
// };
// export default storeOperators;

// export type StoreOperators = typeof storeOperators;
// export type StoreOperator = keyof StoreOperators;
// export type StoreOperatorCode = {
//   [K in StoreOperator]?: Parameters<StoreOperators[K]>[0]
// };
