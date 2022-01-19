import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";

export function $reject(
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value {
  store.set("rejected", new JSON.Bool(true));
  return new JSON.Str("rejected");
}
