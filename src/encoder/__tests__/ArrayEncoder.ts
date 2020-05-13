import { ArrayEncoder } from "../ArrayEncoder";

describe("ArrayEncoder", () => {
  describe("stringEncode", () => {
    it("should be <Buffer 81 61 61>, when input is ['a']", () => {
      const expected = new Buffer([129, 97, 97]);
      const actual = ArrayEncoder.arrayEncode(["a"]);
      expect(actual).toEqual(expected);
    });
  });
});
