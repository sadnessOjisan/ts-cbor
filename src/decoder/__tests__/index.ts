import { Decoder } from "../index";

describe("Decoder", () => {
  describe("stringEncode", () => {
    it("should be 21, when input is 15", () => {
      const expected = 21;
      const actual = Decoder.decode("15");
      expect(actual).toEqual(expected);
    });
  });
});
