import { encodeNumber, encodeToUint16 } from "../encode";

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
      expect(actual).toEqual(expected);
    });
    it("should be that aditional type value(24) next byte is uint8_t value, when input is 255", () => {
      const expected = new Buffer([24, 255]);
      const actual = encodeNumber(255);
      expect(actual).toEqual(expected);
    });
    it("should be that aditional type value(25) next 2byte is uint8_t value, when input is 65535", () => {
      const expected = new Buffer([25, 255, 255]);
      const actual = encodeNumber(65535);
      expect(actual).toEqual(expected);
    });
    it("should be that aditional type value(26) next 4byte is uint8_t value, when input is 4294967295", () => {
      const expected = new Buffer([26, 255, 255, 255, 255]);
      const actual = encodeNumber(4294967295);
      expect(actual).toEqual(expected);
    });
    it("should be that aditional type value(27) next 8byte is uint8_t value, when input is 9007199254740991", () => {
      const expected = new Buffer([27, 0, 31, 255, 255, 255, 255, 255, 254]); // means <Buffer 1b 00 1f ff ff ff ff ff fe>
      const actual = encodeNumber(9007199254740990);
      expect(actual).toEqual(expected);
    });
  });
  describe("encodeToUint16", () => {
    it("should be <Buffer ff ff> when input is 65535", () => {
      const expected = Buffer.allocUnsafe(2); // FIXME: 下とくっつけるとnumberになるのなんで
      expected.writeUInt16BE(65535, 0);
      const actual = encodeToUint16(65535);
      expect(actual).toEqual(expected);
    });
  });
});
