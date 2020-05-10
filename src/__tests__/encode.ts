/**
 * @file TODO: mockを呼び出したかどうかのテストにする
 */

import { Encoder } from "../encoder/Encoder";

describe("encode", () => {
  describe("Encoder.encodeNumber", () => {
    it("should be 00 # unsigned(0), when input is 0", () => {
      const expected = new Buffer([0]);
      const actual = Encoder.encodeNumber(0);
      expect(actual).toEqual(expected);
    });
    it("should be 01 # unsigned(1), when input is 1", () => {
      const expected = new Buffer([1]);
      const actual = Encoder.encodeNumber(1);
      expect(actual).toEqual(expected);
    });
    it("should be 17 # unsigned(23), when input is 23", () => {
      const expected = new Buffer([23]);
      const actual = Encoder.encodeNumber(23);
      expect(actual).toEqual(expected);
    });
    it("should be 18 18 # unsigned(24), when input is 24", () => {
      const expected = new Buffer([24, 24]);
      const actual = Encoder.encodeNumber(24);
      expect(actual).toEqual(expected);
    });
    it("should be 18 FF # unsigned(255), when input is 255", () => {
      const expected = new Buffer([24, 255]);
      const actual = Encoder.encodeNumber(255);
      expect(actual).toEqual(expected);
    });
    it("should be 19 FFFF # unsigned(65535), when input is 65535", () => {
      const expected = new Buffer([25, 255, 255]); // means <Buffer 19 FF FF>
      const actual = Encoder.encodeNumber(65535);
      expect(actual).toEqual(expected);
    });
    it("should be 1A FFFFFFFF # unsigned(4294967295), when input is 4294967295", () => {
      const expected = new Buffer([26, 255, 255, 255, 255]);
      const actual = Encoder.encodeNumber(4294967295);
      expect(actual).toEqual(expected);
    });
    it("should be 1B 001FFFFFFFFFFFFE # unsigned(9007199254740990), when input is 9007199254740990", () => {
      const expected = new Buffer([27, 0, 31, 255, 255, 255, 255, 255, 254]); // means <Buffer 1b 00 1f ff ff ff ff ff fe>
      const actual = Encoder.encodeNumber(9007199254740990);
      expect(actual).toEqual(expected);
    });
    // --------negative--------
    it("should be 20 # negative(0) when input is -1", () => {
      const expected = new Buffer([32]);
      const actual = Encoder.encodeNumber(-1);

      expect(actual).toEqual(expected);
    });
    it("should be 38 FE # negative(254) when input is -255", () => {
      const expected = new Buffer([56, 254]);
      const actual = Encoder.encodeNumber(-255);
      expect(actual).toEqual(expected);
    });
    it("should be 39 FFFE # negative(65534) when input is -65535", () => {
      const expected = new Buffer([57, 255, 254]);
      const actual = Encoder.encodeNumber(-65535);
      expect(actual).toEqual(expected);
    });
    it("should be 3A FFFFFFFE # negative(4294967295) when input is -4294967295", () => {
      const expected = new Buffer([58, 255, 255, 255, 254]);
      const actual = Encoder.encodeNumber(-4294967295);
      expect(actual).toEqual(expected);
    });
    it("should be 3B 001FFFFFFFFFFFFD # negative(9007199254740989), when input is -9007199254740990", () => {
      const expected = new Buffer([59, 0, 31, 255, 255, 255, 255, 255, 253]); // means <Buffer 1b 00 1f ff ff ff ff ff fe>
      const actual = Encoder.encodeNumber(-9007199254740990);
      expect(actual).toEqual(expected);
    });
  });
});
