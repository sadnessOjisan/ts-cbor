import { ObjectEndocer } from "../ObjectEncoder";

describe("ObjectEndocer", () => {
  describe("encodeObject", () => {
    it("should be <Buffer a1 61 61 01>, when input is { a: 1 }", () => {
      const expected = new Buffer([161, 97, 97, 1]);
      const actual = ObjectEndocer.encodeObject({ a: 1 });
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer a1 61 61 01>, when input is { a: 1 }", () => {
      const expected = new Buffer([161, 97, 97, 1]);
      const actual = ObjectEndocer.encodeObject({ a: 1 });
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer a4 61 61 01 61 62 20 61 63 82 01 02 61 64 f6>, when input is mixed object, array, negaive, primitive", () => {
      const expected = new Buffer([
        164,
        97,
        97,
        1,
        97,
        98,
        32,
        97,
        99,
        130,
        1,
        2,
        97,
        100,
        246,
      ]);
      const actual = ObjectEndocer.encodeObject({
        a: 1,
        b: -1,
        c: [1, 2],
        d: null,
      });
      expect(actual).toEqual(expected);
    });
    test.todo("keyがたくさんある時のテスト");
  });
});
