import { PositiveNumberDecoder } from "../PositiveNumberDecoder";
import { toCBOR } from "../../helper";

describe("PositiveNumberDecoder", () => {
  describe("decode", () => {
    describe("additionalInformationが0-23", () => {
      test("入力が0x00の時、出力は0", () => {
        const input = toCBOR("00");
        const actual = PositiveNumberDecoder.decode(input);
        expect(actual).toBe(0);
      });
      test("入力が0x17の時、出力は23", () => {
        const input = toCBOR("17");
        const actual = PositiveNumberDecoder.decode(input);
        expect(actual).toBe(23);
      });
    });
    describe("additionalInformationが24以上", () => {
      test("入力が0x18 0x18の時、出力は24", () => {
        const input = toCBOR("1818");
        const actual = PositiveNumberDecoder.decode(input);
        expect(actual).toBe(24);
      });
      test("入力が190100の時、出力は256", () => {
        const input = toCBOR("190100");
        const actual = PositiveNumberDecoder.decode(input);
        expect(actual).toBe(256);
      });
    });
    describe("巨大な数字へのdecode", () => {
      test("入力が 1B001FFFFFFFFFFFFF の時、出力は 9007199254740991", () => {
        const input = toCBOR("1B001FFFFFFFFFFFFF");
        const actual = PositiveNumberDecoder.decode(input);
        expect(actual).toBe(9007199254740991);
      });
    });
  });
});
