import { toCBOR } from "../../helper";
import { NegativeNumberDecoder } from "../NegativeNumberDecoder";

describe("NegativeNumberDecoder", () => {
  describe("decode", () => {
    describe("-0~-24へのdecode", () => {
      test("入力が0x20の時、出力は-1", () => {
        const input = toCBOR("20");
        const actual = NegativeNumberDecoder.decode(input);
        expect(actual).toBe(-1);
      });
      test("入力が0x37の時、出力は-24", () => {
        const input = toCBOR("37");
        const actual = NegativeNumberDecoder.decode(input);
        expect(actual).toBe(-24);
      });
    });
    describe("-25以以下へのdecode", () => {
      test("入力が0x3818の時、出力は-25", () => {
        const input = toCBOR("3818");
        const actual = NegativeNumberDecoder.decode(input);
        expect(actual).toBe(-25);
      });
    });
    describe("巨大な負の数へのdecode", () => {
      test("入力が0x3818の時、出力は入力が0x3B0000000100000000の時、出力は", () => {
        const input = toCBOR("3B0000000100000000");
        const actual = NegativeNumberDecoder.decode(input);
        expect(actual).toBe(-4294967297);
      });
    });
  });
});
