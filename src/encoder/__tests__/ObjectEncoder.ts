import { ObjectEndocer } from "../ObjectEncoder";

describe("ObjectEndocer", () => {
  describe("encodeObject", () => {
    it("should be <Buffer a1 61 61 01>, when input is { a: 1 }", () => {
      const expected = new Buffer([161, 97, 97, 1]);
      const actual = ObjectEndocer.encodeObject({ a: 1 });
      expect(actual).toEqual(expected);
    });
  });
});
