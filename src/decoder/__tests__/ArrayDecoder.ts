import { toCBOR } from "../../helper";
import { ArrayDecoder } from "../ArrayDecoder";

describe("ArrayDecoder", () => {
  describe("decode", () => {
    describe("typeがtiny", () => {
      test.todo("typeが例外");
    });
    describe("typeがshort", () => {
      test.todo("長さが24以上は例外");
      test("長さが0", () => {
        const input = toCBOR("80");
        const actual = ArrayDecoder.decode(input);
        expect(actual).toEqual([]);
      });
      test("長さが23", () => {
        const input = toCBOR("97" + "01".repeat(23));
        const actual = ArrayDecoder.decode(input);
        expect(actual).toEqual(new Array(23).fill(1));
      });
    });
    describe("typeがlong", () => {
      test.todo("長さが23未満は例外");
      test("長さが24", () => {
        const input = toCBOR("9818" + "01".repeat(24));
        const actual = ArrayDecoder.decode(input);
        expect(actual).toEqual(new Array(24).fill(1));
      });
      test.todo("長さがとても長い");
    });
    describe("マルチバイト", () => {
      test("長さが256", () => {
        const input = toCBOR("990100" + "63E38182".repeat(256));
        const actual = ArrayDecoder.decode(input);
        expect(actual).toEqual(new Array(256).fill("あ"));
      });
    });
    describe("nest", () => {
      test("[1,[2,3]]", () => {
        const input = toCBOR("8201820203");
        const actual = ArrayDecoder.decode(input);
        expect(actual).toEqual([1, [2, 3]]);
      });
    });
  });
});
