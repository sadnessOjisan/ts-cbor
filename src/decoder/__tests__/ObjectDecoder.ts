import { ObjectDecoder } from "../ObjectDecoder";
import { toCBOR } from "../../helper";

describe("ObjectDecoder", () => {
  describe("decode", () => {
    describe("typeがtiny", () => {
      test.todo("typeが例外");
    });
    describe("typeがshort", () => {
      test.todo("長さが24以上は例外");
      test("長さが1", () => {
        const input = toCBOR("A1616101");
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({ a: 1 });
      });
      test("配列を含む", () => {
        const input = toCBOR("A16161820102");
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({ a: [1, 2] });
      });
      test("オブジェクトをネスト", () => {
        const input = toCBOR("A16161A1616101");
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({ a: { a: 1 } });
      });
      test("マルチバイト", () => {
        const input = toCBOR("A16161A163E3818201");
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({ a: { あ: 1 } });
      });
      test("キーに数値混在", () => {
        const input = toCBOR("A1626139A163E3818201");
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({ a9: { あ: 1 } });
      });
      test("複数のキー", () => {
        const input = toCBOR("A2616101616202");
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({ a: 1, b: 2 });
      });
      test("ちょっと複雑", () => {
        const input = toCBOR("A2626139A163E38182016262328201625638");
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({ a9: { あ: 1 }, b2: [1, "V8"] });
      });
      test("長さが23", () => {
        const input = toCBOR(
          "B7616101616202616303616404616505616606616707616808616909616A0A6261300B626230166263300D6264300E6265300F62663010626730116268301262693013626A3014636161301563626230166363633017"
        );
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: 5,
          f: 6,
          g: 7,
          h: 8,
          i: 9,
          j: 10,
          a0: 11,
          b0: 22,
          c0: 13,
          d0: 14,
          e0: 15,
          f0: 16,
          g0: 17,
          h0: 18,
          i0: 19,
          j0: 20,
          aa0: 21,
          bb0: 22,
          cc0: 23,
        });
      });
    });
    describe("typeがlong", () => {
      test.todo("長さが23未満は例外");
      test("長さが24", () => {
        const input = toCBOR(
          "B818616101616202616303616404616505616606616707616808616909616A0A6261300B626230166263300D6264300E6265300F62663010626730116268301262693013626A30146361613015636262301663636330170000"
        );
        const actual = ObjectDecoder.decode(input);
        expect(actual).toEqual({
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: 5,
          f: 6,
          g: 7,
          h: 8,
          i: 9,
          j: 10,
          a0: 11,
          b0: 22,
          c0: 13,
          d0: 14,
          e0: 15,
          f0: 16,
          g0: 17,
          h0: 18,
          i0: 19,
          j0: 20,
          aa0: 21,
          bb0: 22,
          cc0: 23,
          0: 0,
        });
      });
    });
  });
});
