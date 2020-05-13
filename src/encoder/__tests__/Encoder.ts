import { Encoder } from "../Encoder";

describe("Encoder", () => {
  describe("encodeAny", () => {
    describe("number", () => {
      it("should be <Buffer 1>, when input is number", () => {
        const expected = new Buffer([1]);
        const actual = Encoder.encodeAny(1);
        expect(actual).toEqual(expected);
      });
    });
    describe("string", () => {
      it("should be <Buffer 61 61>, when input is string", () => {
        const expected = new Buffer([97, 97]);
        const actual = Encoder.encodeAny("a");
        expect(actual).toEqual(expected);
      });
    });
    describe("boolean", () => {
      it("should be <Buffer f5>, when input is true", () => {
        const expected = new Buffer([245]);
        const actual = Encoder.encodeAny(true);
        expect(actual).toEqual(expected);
      });
    });
    describe("undefined", () => {
      it("should be <Buffer f7>, when input is undefined", () => {
        const expected = new Buffer([247]);
        const actual = Encoder.encodeAny(undefined);
        expect(actual).toEqual(expected);
      });
    });
    describe("null", () => {
      it("should be <Buffer f6>, when input is null", () => {
        const expected = new Buffer([246]);
        const actual = Encoder.encodeAny(null);
        expect(actual).toEqual(expected);
      });
    });
  });
});
