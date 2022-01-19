import objectBuiltIns from "../object-built-ins";

const { $exists, $keys } = objectBuiltIns;

describe("Object built-ins test suite", () => {
  describe("$exists tests", () => {
    describe("When passing a non-existing property", () => {
      it("Should return false if no second argument", () => {
        const result = $exists(["prop1"], {});
        expect(result).toBeFalsy();
      });
      it("Should return false if second argument is true", () => {
        const result = $exists(["prop1", true], {});
        expect(result).toBeFalsy();
      });
      it("Should return true if second argument is false", () => {
        const result = $exists(["prop1", false], {});
        expect(result).toBeTruthy();
      });
    });

    describe("When passing an invalid path", () => {
      it("Should throw `Invalid path provided` error", () => {
        let path: any = undefined;
        expect(() => $exists([path], {})).toThrowError(
          `Invalid path provided, path=${path}`
        );
        path = null;
        expect(() => $exists([path], {})).toThrowError(
          `Invalid path provided, path=${path}`
        );
        path = 23434;
        expect(() => $exists([path], {})).toThrowError(
          `Invalid path provided, path=${path}`
        );
        path = true;
        expect(() => $exists([path], {})).toThrowError(
          `Invalid path provided, path=${path}`
        );
      });
    });

    describe("When passing a non-existing member property", () => {
      it("Should return false if no second argument", () => {
        const result = $exists(["parent.prop1"], {});
        expect(result).toBeFalsy();
      });
    });

    describe("When passing an existing property", () => {
      it("Should return true if no second argument", () => {
        const context = { prop1: "Value of prop1" };
        const result = $exists(["prop1"], context);
        expect(result).toBeTruthy();
      });
      it("Should return true if second argument is true", () => {
        const context = { prop1: "Value of prop1" };
        const result = $exists(["prop1", true], context);
        expect(result).toBeTruthy();
      });
      it("Should return false if second argument is false", () => {
        const context = { prop1: "Value of prop1" };
        const result = $exists(["prop1", false], context);
        expect(result).toBeFalsy();
      });
    });
  });

  describe("$keys tests", () => {
    describe("When passing an invalid argument", () => {
      it("Should throw an explicit error", () => {
        expect(() => $keys([undefined as any])).toThrowError(
          "Invalid operand passed to $keys:[undefined]"
        );

        expect(() => $keys([null as any])).toThrowError(
          "Invalid operand passed to $keys:[null]"
        );

        expect(() => $keys([0] as any)).toThrowError(
          "Invalid operand passed to $keys:[0]"
        );

        expect(() => $keys(["string"] as any)).toThrowError(
          "Invalid operand passed to $keys:[string]"
        );

        expect(() => $keys([42] as any)).toThrowError(
          "Invalid operand passed to $keys:[42]"
        );

        expect(() => $keys([true] as any)).toThrowError(
          "Invalid operand passed to $keys:[true]"
        );
      });
    });

    describe("When passing a valid object as argument", () => {
      it("Should return it's keys", () => {
        expect($keys([{ key1: null, k2: "something" }])).toEqual([
          "key1",
          "k2",
        ]);
      });
    });
  });
});
