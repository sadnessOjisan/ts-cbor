import { Decoder } from "../";

describe("Decoder", () => {
  describe("plus number decoder", () => {
    describe("additional info 0-23", () => {
      it("should be 0, when input is 0", () => {
        const expected = 0;
        const actual = Decoder.decode("0");
        expect(actual).toEqual(expected);
      });
      it("should be 23, when input is 17", () => {
        const expected = 23;
        const actual = Decoder.decode("17");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 24", () => {
      it("should be 24, when input is 1818", () => {
        const expected = 24;
        const actual = Decoder.decode("1818");
        expect(actual).toEqual(expected);
      });
      it("should be 255, when input is 18FF", () => {
        const expected = 255;
        const actual = Decoder.decode("18FF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 25", () => {
      it("should be 256, when input is 190100", () => {
        const expected = 256;
        const actual = Decoder.decode("190100");
        expect(actual).toEqual(expected);
      });
      it("should be 65535, when input is 19FFFF", () => {
        const expected = 65535;
        const actual = Decoder.decode("19FFFF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 26", () => {
      it("should be 65536, when input is 1A00010000", () => {
        const expected = 65536;
        const actual = Decoder.decode("1A00010000");
        expect(actual).toEqual(expected);
      });
      it("should be 4294967295, when input is 1AFFFFFFFF", () => {
        const expected = 4294967295;
        const actual = Decoder.decode("1AFFFFFFFF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 27", () => {
      it("should be 4294967296, when input is 1B0000000100000000", () => {
        const expected = 4294967296;
        const actual = Decoder.decode("1B0000000100000000");
        expect(actual).toEqual(expected);
      });
      test.todo(
        "Number.MAX_SAFE_INTEGER を対象にテストしたいが溢れてしまうのでテストできない"
      );
    });
  });
  describe("negative number decoder", () => {
    describe("additional info 0 - 23", () => {
      it("should be -1, when input is 20", () => {
        const expected = -1;
        const actual = Decoder.decode("20");
        expect(actual).toEqual(expected);
      });
      it("should be -24, when input is 37", () => {
        const expected = -24;
        const actual = Decoder.decode("37");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 24", () => {
      it("should be -25, when input is 3818", () => {
        const expected = -25;
        const actual = Decoder.decode("3818");
        expect(actual).toEqual(expected);
      });
      it("should be -256, when input is 38FF", () => {
        const expected = -256;
        const actual = Decoder.decode("38FF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 25", () => {
      it("should be -257, when input is 390100", () => {
        const expected = -257;
        const actual = Decoder.decode("390100");
        expect(actual).toEqual(expected);
      });
      it("should be -65536, when input is 39FFFF", () => {
        const expected = -65536;
        const actual = Decoder.decode("39FFFF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 26", () => {
      it("should be -65537, when input is 3A00010000", () => {
        const expected = -65537;
        const actual = Decoder.decode("3A00010000");
        expect(actual).toEqual(expected);
      });
      it("should be -4294967296, when input is 3AFFFFFFFF", () => {
        const expected = -4294967296;
        const actual = Decoder.decode("3AFFFFFFFF");
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 27", () => {
      it("should be -4294967297, when input is 3B0000000100000000", () => {
        const expected = -4294967297;
        const actual = Decoder.decode("3B0000000100000000");
        expect(actual).toEqual(expected);
      });
    });
  });
  describe("string decoder", () => {
    describe("additional info 0 - 23", () => {
      it("should be 'a', when input is 6161", () => {
        const expected = "a";
        const actual = Decoder.decode("6161");
        expect(actual).toEqual(expected);
      });
      it("should be 'aaaaaaaaaaaaaaaaaaaaaaa', when input is 776161616161616161616161616161616161616161616161", () => {
        const expected = "aaaaaaaaaaaaaaaaaaaaaaa";
        const actual = Decoder.decode(
          "776161616161616161616161616161616161616161616161"
        );
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 24", () => {
      it("should be 'aaaaaaaaaaaaaaaaaaaaaaaa', when input is 776161616161616161616161616161616161616161616161", () => {
        const expected = "aaaaaaaaaaaaaaaaaaaaaaaa";
        const actual = Decoder.decode(
          "7818616161616161616161616161616161616161616161616161"
        );
        expect(actual).toEqual(expected);
      });
      it("should be 'a*255', when input is 78FFa*255", () => {
        const expected = "a".repeat(255);
        const actual = Decoder.decode(
          `78FF` + new Array(255).fill("61").join("")
        );
        expect(actual).toEqual(expected);
      });
    });
    describe("additional info 25", () => {
      it("should be 'a*256', when input is 79010061616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161", () => {
        const expected = "a".repeat(256);
        const actual = Decoder.decode(
          "790100" + new Array(256).fill("61").join("")
        );
        expect(actual).toEqual(expected);
      });
    });
  });
  describe("array decoder", () => {
    describe("additional info 0 - 23", () => {
      it("should be [1, 1], when input is 820101", () => {
        const expected = [1, 1];
        const actual = Decoder.decode("820101");
        expect(actual).toEqual(expected);
      });
      it("should be [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], when input is 820101", () => {
        const expected = new Array(23).fill(1);
        const actual = Decoder.decode(
          "970101010101010101010101010101010101010101010101"
        );
        expect(actual).toEqual(expected);
      });
      it('should be ["a",1,"a",1,"a",1,"a",1,"a",1,"a",1,"a",1,"a",1,"a",1,"a",1,"a",1,"a"]a, when input is 820101', () => {
        const expected = [
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
          1,
          "a",
        ];
        const actual = Decoder.decode(
          "97616101616101616101616101616101616101616101616101616101616101616101616161"
        );
        expect(actual).toEqual(expected);
      });
    });
  });
});
