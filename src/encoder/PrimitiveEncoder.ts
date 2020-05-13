/**
 * @file primitiveのエンコード. エンコードルールは https://tools.ietf.org/html/rfc7049#section-2.1 のMajor Type 7を参照.
 */

import { majorType } from "../const";

/**
 * primitiveのエンコード関数をまとめたクラス.
 * Major Typeは7.
 */
export class PrimitiveEncoder {
  /**
   * 1byteで表現されるdata item headerの先頭3bit.
   * 8bitあるうちの先頭3bitにcategory typeを持ってきたいのでmajor typeを5bitシフトさせる.
   */
  static shiftedMajorType = majorType.primitive.type << 5;

  /**
   * primitiveのencodeを行う.
   * @param num primitiveを表す数値
   */
  static primitiveEncode(num: number) {
    const dataItemHeader = this.shiftedMajorType | num;
    const b = Buffer.allocUnsafe(1);
    b.writeUInt8(dataItemHeader, 0);
    return b;
  }
}
