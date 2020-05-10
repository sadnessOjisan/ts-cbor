import { PositiveEncoder } from "../PositiveEncoder";

describe("PositiveEncoder", () => {
  describe("ai023encode", () => {
    it("should be <Buffer 0>, when input is 0", () => {
      const expected = new Buffer([0]);
      const actual = PositiveEncoder.ai023encode(0);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 17>, when input is 23", () => {
      const expected = new Buffer([23]);
      const actual = PositiveEncoder.ai023encode(23);

      expect(actual).toEqual(expected);
    });
  });
  describe("ai24encode", () => {
    it("should be<Buffer 18 18>, when input is 24", () => {
      const expected = new Buffer([24, 24]);
      const actual = PositiveEncoder.ai24encode(24);

      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 18 ff>, when input is 255", () => {
      const expected = new Buffer([24, 255]);
      const actual = PositiveEncoder.ai24encode(255);
      expect(actual).toEqual(expected);
    });
  });
  describe("ai25encode", () => {
    it("should be <Buffer 19 01 00>, when input is 256", () => {
      const expected = new Buffer([25, 1, 0]);
      const actual = PositiveEncoder.ai25encode(256);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 19 ff ff>, when input is 65535", () => {
      const expected = new Buffer([25, 255, 255]);
      const actual = PositiveEncoder.ai25encode(65535);
      expect(actual).toEqual(expected);
    });
  });
  describe("ai26encode", () => {
    it("should be <Buffer 1a 00 01 00 00>, when input is 65536", () => {
      const expected = new Buffer([26, 0, 1, 0, 0]);
      const actual = PositiveEncoder.ai26encode(65536);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 1a ff ff ff ff>, when input is 4294967295", () => {
      const expected = new Buffer([26, 255, 255, 255, 255]);
      const actual = PositiveEncoder.ai26encode(4294967295);
      expect(actual).toEqual(expected);
    });
  });
  describe("ai27encode", () => {
    it("should be <Buffer 1b 00 00 00 01 00 00 00 00>, when input is 4294967296", () => {
      const expected = new Buffer([27, 0, 0, 0, 1, 0, 0, 0, 0]);
      const actual = PositiveEncoder.ai27encode(4294967296);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 1b 00 1f ff ff ff ff ff ff>, when input is 9007199254740991", () => {
      const expected = new Buffer([27, 0, 31, 255, 255, 255, 255, 255, 255]);
      const actual = PositiveEncoder.ai27encode(Number.MAX_SAFE_INTEGER);
      expect(actual).toEqual(expected);
    });
  });
});
