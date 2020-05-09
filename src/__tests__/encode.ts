import { encodeNumber } from "../encode";

describe("encode", () => {
  describe("encodeNumber", () => {
    it("should be 01 when input is 1", () => {
      const expected = Buffer.allocUnsafe(1); // FIXME: 下とくっつけるとnumberになるのなんで
      expected.writeUInt8(1, 0);
      const actual = encodeNumber(1);
      expect(actual).toEqual(expected);
    });
    it("should be 01 when input is 23", () => {
      const expected = Buffer.allocUnsafe(1);
      expected.writeUInt8(23, 0);
      const actual = encodeNumber(23);
      console.log("actual", actual);
      expect(actual).toEqual(expected);
    });
    it("should be that aditional type value(24) next byte is uint8_t value, when input is 255", () => {
      const expected = new Buffer([24, 255]);
      const actual = encodeNumber(255);
      expect(actual).toEqual(expected);
    });
  });
});
