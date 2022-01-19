import typeConversionBuiltIns from "../type-conversion-built-ins";

const { $toDouble, $toInt } = typeConversionBuiltIns;

describe("Type conversion built-ins test suite", () => {
  describe("$toDouble tests", () => {
    describe("When passing a 64 bit floating-point string less than 1", () => {
      it("Should return 64 bit floating-point", () => {
        const result = $toDouble(["0.6978585567702513"]);
        expect(result).toBe(0.6978585567702513);
      });
    });
    describe("When passing a 64 bit floating-point string greater than one", () => {
      it("Should return 64 bit floating-point", () => {
        const result = $toDouble(["12.6978585567702513"]);
        expect(result).toBeCloseTo(12.6978585567702513);
      });
    });
    describe("When passing a -ve 64 bit floating-point string greater than one", () => {
      it("Should return 64 bit floating-point", () => {
        const result = $toDouble(["-12.6978585567702513"]);
        expect(result).toBeCloseTo(-12.6978585567702513);
      });
    });
  });
  describe("$toInt tests", () => {
    describe("When passing a 32 bit ineteger string", () => {
      it("Should return 32 bit ineteger", () => {
        const result = $toInt(["6978585567702513"]);
        expect(result).toBe(6978585567702513);
      });
    });
    describe("When passing a -ve 32 bit ineteger string", () => {
      it("Should return -ve 32 bit ineteger", () => {
        const result = $toInt(["-6978585567702513"]);
        expect(result).toBeCloseTo(-6978585567702513);
      });
    });
  });
});
