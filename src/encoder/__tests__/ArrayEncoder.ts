import { ArrayEncoder } from "../ArrayEncoder";

describe("ArrayEncoder", () => {
  describe("stringEncode", () => {
    it("should be <Buffer 81 61 61>, when input is ['a']", () => {
      const expected = new Buffer([129, 97, 97]);
      const actual = ArrayEncoder.arrayEncode(["a"]);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 98 ff 61 61 61...>, when input is new Array(255).fill(a)", () => {
      //  61 61 でa. つまりaを255個並べるためには97(=0x61, unicodeでa)が510個並ぶ必要がある
      const expected = new Buffer([152, 255].concat(new Array(510).fill(97)));
      const actual = ArrayEncoder.arrayEncode(new Array(255).fill("a"));
      expect(actual).toEqual(expected);
    });
  });
  it("should be <Buffer 99 01 00 61 61...>, when input is new Array(256).fill(a)", () => {
    //  61 61 でa. つまりaを256個並べるためには97(=0x61, unicodeでa)が512個並ぶ必要がある
    const expected = new Buffer([153, 1, 0].concat(new Array(512).fill(97)));
    const actual = ArrayEncoder.arrayEncode(new Array(256).fill("a"));
    expect(actual).toEqual(expected);
  });
  it("should be <Buffer 99 ff ff 61 61...>, when input is new Array(65535).fill(a)", () => {
    //  61 61 でa. つまりaを65535個並べるためには97(=0x61, unicodeでa)が65535*2個並ぶ必要がある
    const expected = new Buffer(
      [153, 255, 255].concat(new Array(65535 * 2).fill(97))
    );
    const actual = ArrayEncoder.arrayEncode(new Array(65535).fill("a"));
    expect(actual).toEqual(expected);
  });
  it("should be <Buffer 9a 00 01 00 00 61 61 61...>, when input is new Array(65536).fill(a)", () => {
    //  61 61 でa. つまりaを65536個並べるためには97(=0x61, unicodeでa)が65536*2個並ぶ必要がある
    const expected = new Buffer(
      [154, 0, 1, 0, 0].concat(new Array(65536 * 2).fill(97))
    );
    const actual = ArrayEncoder.arrayEncode(new Array(65536).fill("a"));
    expect(actual).toEqual(expected);
  });
  // memory足りないから実行できない
  test.todo(
    "should be <Buffer 99 01 00 61 61...>, when input is new Array(4294967295).fill(a)"
  );
  // memory足りないから実行できない
  test.todo(
    "should be <Buffer 99 01 00 61 61...>, when input is new Array(4294967296).fill(a)"
  );
  describe("multi byte文字", () => {
    it("should be <Buffer 81 63 e3 81 82>, when input is [あ]", () => {
      const expected = new Buffer([129, 99, 227, 129, 130]);
      const actual = ArrayEncoder.arrayEncode(["あ"]);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer 98 ff 63 e3 81 82 63 e3 81 82 63 e3 81 82>, when input is [あ]", () => {
      const expected = new Buffer(
        [152, 255].concat(
          Array.from(new Array(255).fill([99, 227, 129, 130]).flat())
        )
      );
      const actual = ArrayEncoder.arrayEncode(new Array(255).fill("あ"));
      expect(actual).toEqual(expected);
    });
  });
});
