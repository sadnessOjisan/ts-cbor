import { StringEncoder } from "../StringEncoder";

describe("NegativeEncoder", () => {
  describe("ai023encode", () => {
    it("should be <Buffer 61 61>, when input is -1", () => {
      const expected = new Buffer([97, 97]);
      const actual = StringEncoder.stringEncode("a");
      console.log(actual);
      expect(actual).toEqual(expected);
    });
  });
});
