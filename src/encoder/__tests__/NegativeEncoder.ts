import { NegativeEncoder } from "../NegativeEncoder";

describe("NegativeEncoder", () => {
  describe("ai023encode", () => {
    it("should be <Buffer 20>, when input is -1", () => {
      const expected = new Buffer([32]);
      const actual = NegativeEncoder.ai023encode(-1);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 37>, when input is -24", () => {
      // 37 -> 001 10111 -> mt1 & ai23
      const expected = new Buffer([55]);
      const actual = NegativeEncoder.ai023encode(-24);
      expect(actual).toEqual(expected);
    });
    it("should be invalid input error, when input is -25", () => {
      expect(() => NegativeEncoder.ai023encode(-25)).toThrowError();
    });
  });
  describe("ai24encode", () => {
    it("should be <Buffer 38 18>, when input is -25", () => {
      const expected = new Buffer([56, 24]);
      const actual = NegativeEncoder.ai24encode(-25);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 38 FE>, when input is -255", () => {
      const expected = new Buffer([56, 254]);
      const actual = NegativeEncoder.ai24encode(-255);
      expect(actual).toEqual(expected);
    });
    it("should be invalid input error, when input is -24", () => {
      expect(() => NegativeEncoder.ai24encode(-24)).toThrowError();
    });
    it("should be invalid input error, when input is -256", () => {
      expect(() => NegativeEncoder.ai24encode(-256)).toThrowError();
    });
  });
  describe("ai25encode", () => {
    it("should be <Buffer 39 00 ff>, when input is -256", () => {
      const expected = new Buffer([57, 0, 255]);
      const actual = NegativeEncoder.ai25encode(-256);

      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 39 ff fe>, when input is -65535", () => {
      const expected = new Buffer([57, 255, 254]);
      const actual = NegativeEncoder.ai25encode(-65535);
      expect(actual).toEqual(expected);
    });
    it("should be invalid input error, when input is -255", () => {
      expect(() => NegativeEncoder.ai25encode(-255)).toThrowError();
    });
    it("should be invalid input error, when input is -65536", () => {
      expect(() => NegativeEncoder.ai25encode(-65536)).toThrowError();
    });
  });
  describe("ai26encode", () => {
    it("should be <Buffer 3a 00 00 ff ff>, when input is -65536", () => {
      const expected = new Buffer([58, 0, 0, 255, 255]);
      const actual = NegativeEncoder.ai26encode(-65536);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 3a ff ff ff fe>, when input is -4294967295", () => {
      const expected = new Buffer([58, 255, 255, 255, 254]);
      const actual = NegativeEncoder.ai26encode(-4294967295);
      expect(actual).toEqual(expected);
    });
    it("should be invalid input error, when input is 65535", () => {
      expect(() => NegativeEncoder.ai26encode(-65535)).toThrowError();
    });
    it("should be invalid input error, when input is -4294967296", () => {
      expect(() => NegativeEncoder.ai26encode(-4294967296)).toThrowError();
    });
  });
  describe("ai27encode", () => {
    it("should be <Buffer 3A FF FF FF FE>, when input is -4294967297", () => {
      const expected = new Buffer([59, 0, 0, 0, 1, 0, 0, 0, 0]);
      const actual = NegativeEncoder.ai27encode(-4294967297);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 3b 00 1f ff ff ff ff ff fe>, when input is -9007199254740991", () => {
      const expected = new Buffer([59, 0, 31, 255, 255, 255, 255, 255, 254]);
      const actual = NegativeEncoder.ai27encode(-Number.MAX_SAFE_INTEGER);
      expect(actual).toEqual(expected);
    });
    it("should be invalid input error, when input is 4294967294", () => {
      expect(() => NegativeEncoder.ai27encode(-4294967294)).toThrowError();
    });
    it("should be invalid input error, when input is -9007199254740992", () => {
      expect(() =>
        NegativeEncoder.ai27encode(-9007199254740992)
      ).toThrowError();
    });
  });
});
