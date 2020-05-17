import { separateTokenFromCBOR, toCBOR, hexToDateitemHeader } from "./helper";

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
      const actual = separateTokenFromCBOR("0");
      expect(actual).toEqual(expected);
    });
  });
  describe("separateTokenFromCBOR", () => {
    test.todo("hoge");
  });
  describe("detectCborTypeFromBaseCbor", () => {
    test.todo("hoge");
  });
  describe("hexToDateitemHeader", () => {
    test("0x2のときmajor typeは0", () => {
      const actual = hexToDateitemHeader(0x2);
      expect(actual).toEqual({ majorType: 0, additionalInformation: 2 });
    });
    test("0x61のときmajor typeは3", () => {
      const actual = hexToDateitemHeader(0x61);
      expect(actual).toEqual({ majorType: 3, additionalInformation: 1 });
    });
    test("0x6161のとき例外", () => {
      expect(() => hexToDateitemHeader(0x6161)).toThrowError();
    });
  });
  describe("toCBOR", () => {
    test("正の数", () => {
      const actual = toCBOR("00");
      expect(actual).toEqual({
        type: undefined,
        raw: "00",
        majorType: 0,
        additionalInformation: 0,
      });
    });
    test("文字列", () => {
      const actual = toCBOR("6161");
      expect(actual).toEqual({
        type: undefined,
        raw: "6161",
        majorType: 3,
        additionalInformation: 1,
      });
    });
    test("マルチバイト文字列", () => {
      const actual = toCBOR(
        "7875E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182"
      );
      expect(actual).toEqual({
        type: undefined,
        raw:
          "7875E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182",
        majorType: 3,
        additionalInformation: 24,
      });
    });
  });
  describe("throwableDecode", () => {
    test.todo("hoge");
  });
});
