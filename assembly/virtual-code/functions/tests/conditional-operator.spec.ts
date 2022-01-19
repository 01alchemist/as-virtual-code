import { JSON } from "assemblyscript-json";
import { EvaluationContext, EvaluationStore } from "../..";
import { $select, $selectIf, $evaluateIf } from "../conditional-operators";
import { jsonToBoolean, jsonToNumber } from "../utils";
import { b, Null, o } from "./utils";

const context = new EvaluationContext();
const store = new EvaluationStore();

describe("Conditional operator test suite", () => {
  describe("$select test suite", () => {
    describe("When passing falsy arguments", () => {
      it("Should return first defined and non-null value", () => {
        expect(
          jsonToBoolean($select([Null(), b(false), b(true)], context, store))
        ).toBe(false);
      });
    });
    describe("When passing falsy arguments", () => {
      it("Should return first defined and non-null value", () => {
        expect(
          jsonToBoolean($select([b(false), b(true)], context, store))
        ).toBe(false);
      });
    });
  });
  describe("$selectIf test suite", () => {
    describe("When passing falsy arguments", () => {
      it("Should return matched value by condition", () => {
        expect(
          jsonToBoolean(
            $selectIf(
              [Null(), b(false), b(true), o('{ "$eq": ["$this", false] }')],
              context,
              store
            )
          )
        ).toBe(false);
      });
    });
  });
  describe("$evaluateIf test suite", () => {
    describe("When passing truthy condition", () => {
      it("Should return evaluated value", () => {
        const context = new EvaluationContext(
          <JSON.Obj>o('{ "prop1": "prop1", "prop2": 120}')
        );
        const operand = o(
          '[{ "$max": [1, "$prop2"] }, { "$eq": ["$prop1", "prop1"] }]'
        );
        expect(jsonToNumber($evaluateIf([operand], context, store))).toBe(120);
      });
    });
    describe("When passing falsy condition", () => {
      it("Should not evaluate and return null", () => {
        const operand = o('[{ "$max": [1, "$prop2"] }, false]');
        expect($evaluateIf([operand], context, store)).toBeNull();
      });
    });
  });
});
