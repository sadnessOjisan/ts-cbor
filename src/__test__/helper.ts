import { separateTokenFromCBOR } from "../helper";

describe("Helper", () => {
  describe("separateTokenFromCBOR", () => {
    test("0を含まない", () => {
      const expected = {
        token: "62",
        rest: "6161",
      };
      const actual = separateTokenFromCBOR("626161");
      expect(actual).toEqual(expected);
    });
    test("0を含む", () => {
      const expected = {
        token: "01",
        rest: "01",
      };
      const actual = separateTokenFromCBOR("0101");
      expect(actual).toEqual(expected);
    });
    test("00のみ", () => {
      const expected = {
        token: "00",
        rest: null,
      };
      const actual = separateTokenFromCBOR("00");
      expect(actual).toEqual(expected);
    });
    test("0のみ", () => {
      const expected = {
        token: "0",
        rest: null,
      };
      const actual = separateTokenFromCBOR("00");
      expect(actual).toEqual(expected);
    });
  });
  describe("separateTokenFromCBOR", () => {});
  describe("detectCborTypeFromBaseCbor", () => {});
  describe("hexToDateitemHeader", () => {});
  describe("toCBOR", () => {});
  describe("throwableDecode", () => {});
});
