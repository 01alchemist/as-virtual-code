import logicalOperators from "../logical-operators";

const { $and, $or, $not } = logicalOperators;

describe("Logical operators test suite", () => {
  describe("When passing empty operands to $and operator", () => {
    it("Should return undefined", () => {
      expect($and([])).toBe(undefined);
    });
  });

  describe("When passing truthy operands to $and operator", () => {
    it("Should return last truthy operand", () => {
      expect($and([1, 2, 3])).toBe(3);
    });
  });

  describe("When passing truthy and falsy operands to $and operator", () => {
    it("Should return first falsy operand", () => {
      expect($and([1, 2, 0, 3, false])).toBe(0);
    });
  });

  describe("When passing truthy operands to $or operator", () => {
    it("Should return first truthy operand", () => {
      expect($or([1, 2, 3])).toBe(1);
    });
  });

  describe("When passing empty operands to $or operator", () => {
    it("Should return undefined", () => {
      expect($or([])).toBe(undefined);
    });
  });

  describe("When passing truthy and falsy operands to $or operator", () => {
    it("Should return first truthy operand", () => {
      expect($or([0, 2, 0, 3, false])).toBe(2);
    });
  });

  describe("When passing truthy operand to $not operator", () => {
    it("Should return false", () => {
      expect($not([1])).toBeFalsy();
    });
  });

  describe("When passing falsy operand to $not operator", () => {
    it("Should return true", () => {
      expect($not([0])).toBeTruthy();
    });
  });
});
