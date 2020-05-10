import { encodeNumber, encodeToUint16 } from "../encode";

describe("encode", () => {
  describe("encodeNumber", () => {
    it("should be 01 # unsigned(1), when input is 1", () => {
      const expected = Buffer.allocUnsafe(1); // FIXME: 下とくっつけるとnumberになるのなんで
      expected.writeUInt8(1, 0);
      const actual = encodeNumber(1);
      expect(actual).toEqual(expected);
    });
    it("should be 17 # unsigned(23), when input is 23", () => {
      const expected = Buffer.allocUnsafe(1);
      expected.writeUInt8(23, 0);
      const actual = encodeNumber(23);
      expect(actual).toEqual(expected);
    });
    it("should be 18 FF # unsigned(255), when input is 255", () => {
      const expected = new Buffer([24, 255]);
      const actual = encodeNumber(255);
      expect(actual).toEqual(expected);
    });
    it("should be 19 FFFF # unsigned(65535), when input is 65535", () => {
      const expected = new Buffer([25, 255, 255]); // means <Buffer 19 FF FF>
      const actual = encodeNumber(65535);
      expect(actual).toEqual(expected);
    });
    it("should be 1A FFFFFFFF # unsigned(4294967295), when input is 4294967295", () => {
      const expected = new Buffer([26, 255, 255, 255, 255]);
      const actual = encodeNumber(4294967295);
      expect(actual).toEqual(expected);
    });
    it("should be 1B 001FFFFFFFFFFFFE # unsigned(9007199254740990), when input is 9007199254740990", () => {
      const expected = new Buffer([27, 0, 31, 255, 255, 255, 255, 255, 254]); // means <Buffer 1b 00 1f ff ff ff ff ff fe>
      const actual = encodeNumber(9007199254740990);
      expect(actual).toEqual(expected);
    });
    // --------negative--------
    it("should be 20 # negative(0) when input is -1", () => {
      const expected = new Buffer([32]);
      const actual = encodeNumber(-1);

      expect(actual).toEqual(expected);
    });
    it("should be 38 FE # negative(254) when input is -255", () => {
      const expected = new Buffer([56, 254]);
      const actual = encodeNumber(-255);
      expect(actual).toEqual(expected);
    });
    it("should be 39 FFFE # negative(65534) when input is -65535", () => {
      const expected = new Buffer([57, 255, 254]);
      const actual = encodeNumber(-65535);
      expect(actual).toEqual(expected);
    });
    it("should be 3A FFFFFFFE # negative(4294967295) when input is -4294967295", () => {
      const expected = new Buffer([58, 255, 255, 255, 254]);
      const actual = encodeNumber(-4294967295);
      expect(actual).toEqual(expected);
    });
  });
  describe("encodeToUint16", () => {
    it("should be <Buffer ff ff> when input is 65535", () => {
      const expected = Buffer.allocUnsafe(2);
      expected.writeUInt16BE(65535, 0);
      const actual = encodeToUint16(65535);
      expect(actual).toEqual(expected);
    });
  });
});
