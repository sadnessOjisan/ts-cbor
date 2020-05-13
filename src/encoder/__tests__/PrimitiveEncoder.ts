import { PrimitiveEncoder } from "../PrimitiveEncoder";
import { PRIMITIVE_TYPE } from "../../const";

describe("PrimitiveEncoder", () => {
  describe("stringEncode", () => {
    it("should be <Buffer f4>, when input is false", () => {
      const expected = new Buffer([244]);
      const actual = PrimitiveEncoder.primitiveEncode(PRIMITIVE_TYPE.FALSE);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer f5>, when input is true", () => {
      const expected = new Buffer([245]);
      const actual = PrimitiveEncoder.primitiveEncode(PRIMITIVE_TYPE.TRUE);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer f6>, when input is null", () => {
      const expected = new Buffer([246]);
      const actual = PrimitiveEncoder.primitiveEncode(PRIMITIVE_TYPE.NULL);
      expect(actual).toEqual(expected);
    });
    it("should be <Buffer f7>, when input is undefined", () => {
      const expected = new Buffer([247]);
      const actual = PrimitiveEncoder.primitiveEncode(PRIMITIVE_TYPE.UNDEFINED);
      expect(actual).toEqual(expected);
    });
  });
});
