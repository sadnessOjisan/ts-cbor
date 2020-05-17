import { toCBOR } from "../../helper";
import { PrimitiveDecoder } from "../PrimitiveDecoder";

describe("StringDecoder", () => {
  describe("decode", () => {
    test("false", () => {
      const input = toCBOR("F4");
      const actual = PrimitiveDecoder.decode(input);
      expect(actual).toBe(false);
    });
    test("true", () => {
      const input = toCBOR("F5");
      const actual = PrimitiveDecoder.decode(input);
      expect(actual).toBe(true);
    });
    test("null", () => {
      const input = toCBOR("F6");
      const actual = PrimitiveDecoder.decode(input);
      expect(actual).toBe(null);
    });
    test("undefined", () => {
      const input = toCBOR("F7");
      const actual = PrimitiveDecoder.decode(input);
      expect(actual).toBe(undefined);
    });
  });
});
