import { $store } from "../store-operators";

describe("$store operator test suite", () => {
  describe("When passing a value to store", () => {
    it("Should store in context object", () => {
      const store: any = {};
      $store(["prop1", "some-props"], {}, store);
      expect(store.prop1).toBe("some-props");
    });
  });
});
