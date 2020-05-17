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
      test.todo("入力が0x17の時、出力は23");
    });
    describe("additionalInformationが24以上", () => {
      test.todo("");
    });
    describe("巨大な数字へのdecode", () => {
      test.todo("");
    });
  });
});
