import { StringEncoder } from "../StringEncoder";

describe("StringEncoder", () => {
  describe("stringEncode", () => {
    it("should be <Buffer 61 61>, when input is a", () => {
      const expected = new Buffer([97, 97]);
      const actual = StringEncoder.stringEncode("a");
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 77 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61>, when input is a * 23", () => {
      const expected = new Buffer([119].concat(new Array(23).fill(97)));
      const actual = StringEncoder.stringEncode("aaaaaaaaaaaaaaaaaaaaaaa");
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 78 18 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61>, when input is a * 24", () => {
      const expected = new Buffer([120, 24].concat(new Array(24).fill(97)));
      const actual = StringEncoder.stringEncode("a".repeat(24));
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 79 01 00 61 61 ... 209 more bytes>, when input is a * 256", () => {
      const expected = new Buffer([121, 1, 0].concat(new Array(256).fill(97)));
      const actual = StringEncoder.stringEncode("a".repeat(256));
      expect(actual).toEqual(expected);
    });
    it("should be<Buffer 7a 00 01 00 01 61 61 61 61 61... >, when input is a x 65537", () => {
      const expected = new Buffer(
        [122, 0, 1, 0, 1].concat(new Array(65537).fill(97))
      );
      const actual = StringEncoder.stringEncode("a".repeat(65537));
      expect(actual).toEqual(expected);
    });
    it("(unicode) should be <Buffer 63 e3 81 82>, when input is あ", () => {
      const expected = new Buffer([99, 227, 129, 130]);
      const actual = StringEncoder.stringEncode("あ");
      expect(actual).toEqual(expected);
    });
  });
});
