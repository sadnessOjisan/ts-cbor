import { Decoder } from "../index";

describe("Decoder", () => {
  describe("plus number decoder", () => {
    describe("additional info 0-23", () => {
      it("should be 0, when input is 0", () => {
        const expected = 0;
        const actual = Decoder.decode("0");
        expect(actual).toEqual(expected);
      });
      it("should be 23, when input is 17", () => {
        const expected = 23;
        const actual = Decoder.decode("17");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 24", () => {
      it("should be 24, when input is 1818", () => {
        const expected = 24;
        const actual = Decoder.decode("1818");
        expect(actual).toEqual(expected);
      });
      it("should be 255, when input is 18FF", () => {
        const expected = 255;
        const actual = Decoder.decode("18FF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 25", () => {
      it("should be 256, when input is 190100", () => {
        const expected = 256;
        const actual = Decoder.decode("190100");
        expect(actual).toEqual(expected);
      });
      it("should be 65535, when input is 19FFFF", () => {
        const expected = 65535;
        const actual = Decoder.decode("19FFFF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 26", () => {
      it("should be 65536, when input is 1A00010000", () => {
        const expected = 65536;
        const actual = Decoder.decode("1A00010000");
        expect(actual).toEqual(expected);
      });
      it("should be 4294967295, when input is 1AFFFFFFFF", () => {
        const expected = 4294967295;
        const actual = Decoder.decode("1AFFFFFFFF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 27", () => {
      it("should be 4294967296, when input is 1B0000000100000000", () => {
        const expected = 4294967296;
        const actual = Decoder.decode("1B0000000100000000");
        expect(actual).toEqual(expected);
      });
      test.todo(
        "Number.MAX_SAFE_INTEGER を対象にテストしたいが溢れてしまうのでテストできない"
      );
    });
  });
});
