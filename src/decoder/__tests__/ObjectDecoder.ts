import { ObjectDecoder } from "../ObjectDecoder";

describe("ObjectDecoder", () => {
  describe("decode", () => {
    describe("typeがtiny", () => {
      test("typeが例外", () => {
        ObjectDecoder.decode();
      });
    });
    describe("typeがshort", () => {
      test.todo("長さが24以上は例外");
      test.todo("長さが0");
      test.todo("長さが23");
    });
    describe("typeがlong", () => {
      test.todo("長さが23未満は例外");
      test.todo("長さが24");
    });
  });
});
