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
  describe("エッジケース", () => {
    test("入力が 82F7F4 の時、出力は [undefined, false]", () => {
      const input = toCBOR("82F7F4");
      const actual = ArrayDecoder.decode(input);
      expect(actual).toEqual([undefined, false]);
    });
    test("入力が 82F7 の時、例外", () => {
      // なんか [undefined,undefined]でかえってた
      const input = toCBOR("82F7");
      expect(() => ArrayDecoder.decode(input)).toThrowError();
    });
    test("入力が 82F7190100 の時、出力は [undefined, 256]", () => {
      const input = toCBOR("82F7190100");
      const actual = ArrayDecoder.decode(input);
      expect(actual).toEqual([undefined, 256]);
    });
    test("配列の中にオブジェクト. 入力が 81A166E38182E381826AE38184E38184E3818430 の時、出力は[{ ああ: 'いいい0' }]", () => {
      const input = toCBOR("81A166E38182E381826AE38184E38184E3818430");
      const actual = ArrayDecoder.decode(input);
      expect(actual).toEqual([{ ああ: "いいい0" }]);
    });
    test("配列の中にオブジェクト2. 入力が 8401F6190100A263E3818282F7F465E38182307AA161737878E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182 の時、出力は[{ ああ: 'いいい0' }]", () => {
      const input = toCBOR(
        "8401F6190100A263E3818282F7F465E38182307AA161737878E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182"
      );
      const actual = ArrayDecoder.decode(input);
      expect(actual).toEqual([
        1,
        null,
        256,
        {
          あ: [undefined, false],
          あ0z: {
            s:
              "ああああああああああああああああああああああああああああああああああああああああ",
          },
        },
      ]);
    });
  });
});
