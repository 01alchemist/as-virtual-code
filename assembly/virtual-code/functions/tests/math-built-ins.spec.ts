import mathBuiltIns, { $isNaN, $max, $min } from "../math-built-ins";

const { $abs } = mathBuiltIns;

describe("Math built-ins test suite", () => {
  describe("$abs test suite", () => {
    describe("When passing negative number to $abs", () => {
      it("Should return it's positive value", () => {
        expect($abs([-4.2345])).toBe(4.2345);
      });
    });
    describe("When passing positive number to $abs", () => {
      it("Should return same value", () => {
        expect($abs([4.2345])).toBe(4.2345);
      });
    });
  });
  describe("$isNaN test suite", () => {
    describe("When passing number to $isNaN", () => {
      it("Should return false", () => {
        expect($isNaN([1])).toBeFalsy();
      });
    });

    describe("When passing number string to $isNaN", () => {
      it("Should return false", () => {
        expect($isNaN(["123" as any])).toBeFalsy();
      });
    });

    describe("When passing non-number to $isNaN", () => {
      it("Should return true", () => {
        expect($isNaN(["string" as any])).toBeTruthy();
      });
    });
  });

  describe("$min test suite", () => {
    describe("When passing +ve numbers", () => {
      it("Should return smallest number from the list", () => {
        expect($min([10, 3, 4, 5, 234, 5, 2, 234])).toBe(2);
      });
    });
    describe("When passing -ve numbers", () => {
      it("Should return smallest number from the list", () => {
        expect($min([-10, -3, -4, -5, -233, -5, -2, -234])).toBe(-234);
      });
    });
    describe("When passing -ve & +ve numbers", () => {
      it("Should return smallest number from the list", () => {
        expect($min([10, -3, 4, -5, 233, 5, 2, 234])).toBe(-5);
      });
    });
  });
  describe("$max test suite", () => {
    describe("When passing +ve numbers", () => {
      it("Should return largest number from the list", () => {
        expect($max([10, 3, 4, 5, 232, 5, 2, 234])).toBe(234);
      });
    });
    describe("When passing -ve numbers", () => {
      it("Should return largest number from the list", () => {
        expect($max([-10, -3, -4, -5, -233, -5, -2, -234])).toBe(-2);
      });
    });
    describe("When passing -ve & +ve numbers", () => {
      it("Should return largest number from the list", () => {
        expect($max([10, -3, 4, -5, 233, 5, 2, 234])).toBe(234);
      });
    });
  });
});
