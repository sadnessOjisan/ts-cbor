import { StringEncoder } from "../StringEncoder";

describe("StringEncoder", () => {
  describe("stringEncode", () => {
    it("should be <Buffer 61 61>, when input is a", () => {
      const expected = new Buffer([97, 97]);
      const actual = StringEncoder.stringEncode("a");
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 77 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61>, when input is aaaaaaaaaaaaaaaaaaaaaaa", () => {
      const expected = new Buffer([119].concat(new Array(23).fill(97)));
      const actual = StringEncoder.stringEncode("aaaaaaaaaaaaaaaaaaaaaaa");
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 78 18 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61>, when input is aaaaaaaaaaaaaaaaaaaaaaaa", () => {
      const expected = new Buffer([120, 24].concat(new Array(24).fill(97)));
      const actual = StringEncoder.stringEncode("aaaaaaaaaaaaaaaaaaaaaaaa");
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 79 01 00 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 ... 209 more bytes>, when input is aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", () => {
      const expected = new Buffer([121, 1, 0].concat(new Array(256).fill(97)));
      const actual = StringEncoder.stringEncode(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      );
      expect(actual).toEqual(expected);
    });
  });
});
