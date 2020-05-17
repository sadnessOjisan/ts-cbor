import { Decoder } from "../";

describe("Decoder", () => {
  test("複雑なやつ-2", () => {
    const input = "A161618401F6190100A263E3818282F7F465E38182307AA0";
    const expected = {
      a: [
        1,
        null,
        256,
        {
          あ: [undefined, false],
          あ0z: {},
        },
      ],
    };
    const actual = Decoder.decode(input);
    expect(actual).toEqual(expected);
  });
  test("複雑なやつ-1", () => {
    const input =
      "A161618401F6190100A263E3818282F7F465E38182307AA1617363E38182";
    const expected = {
      a: [1, null, 256, { あ: [undefined, false], あ0z: { s: "あ" } }],
    };
    const actual = Decoder.decode(input);
    expect(actual).toEqual(expected);
  });
  test("複雑なやつ-0.3", () => {
    const input =
      "A165E38182307AA161737878E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182";
    const expected = {
      あ0z: {
        s:
          "ああああああああああああああああああああああああああああああああああああああああ",
      },
    };
    const actual = Decoder.decode(input);
    expect(actual).toEqual(expected);
  });
  test("複雑なやつ-0.2", () => {
    const input =
      "A263E3818282F7F465E38182307AA161737878E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182";
    const expected = {
      あ: [undefined, false],
      あ0z: {
        s:
          "ああああああああああああああああああああああああああああああああああああああああ",
      },
    };
    const actual = Decoder.decode(input);
    expect(actual).toEqual(expected);
  });
  test.skip("複雑なやつ-0.5", () => {
    const input =
      "A161618401F6190100A263E3818282F7F465E38182307AA161737878E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182";
    const expected = {
      a: [
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
      ],
    };
    const actual = Decoder.decode(input);
    expect(actual).toEqual(expected);
  });
  test.skip("複雑なやつ", () => {
    const input =
      "A261618501F6190100A263E3818282F7F465E38182307AA161737878E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E38182E381823B000000012A05F1FF63E3819600";
    const expected = {
      a: [
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
        -5000000000,
      ],
      ざ: 0,
    };
    const actual = Decoder.decode(input);
    expect(actual).toEqual(expected);
  });
});
