describe("NegativeNumberDecoder", () => {
  describe("decode", () => {
    describe("-0~-24へのdecode", () => {
      test.todo("入力が0x20の時、出力は-1");
      test.todo("入力が0x37の時、出力は-24");
    });
    describe("-25以以下へのdecode", () => {
      test.todo("入力が0x3818の時、出力は-25");
    });
    describe("巨大な負の数へのdecode", () => {
      test.todo("入力が0x3B0000000100000000の時、出力は-4294967297");
    });
  });
});
