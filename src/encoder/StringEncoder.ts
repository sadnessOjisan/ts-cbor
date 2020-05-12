/**
 * @file 文字列のエンコード. エンコードルールは https://tools.ietf.org/html/rfc7049#section-2.1 のMajor Type 0を参照.
 */

import { majorType } from "../const";

/**
 * 文字列のエンコード関数をまとめたクラス.
 * Major Typeは2.
 */
export class StringEncoder {
  /**
   * 1byteで表現されるdata item headerの先頭3bit.
   * 8bitあるうちの先頭3bitにcategory typeを持ってきたいのでmajor typeを5bitシフトさせる.
   */
  static shiftedMajorType = majorType.text.type << 5;

  /**
   * 例) a => 61 61(unicode表) => 011_00011 xxxxxxxx = 99 xx => 0x63 0xXX
   * 例) aaa => 63 61(unicode表) => 011_00100 xxxxxxxx = 101 xx => 0x63 0xXX
   * 例) aaaaaaaaaaaaaaaaaaaaaaa => 77 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61(unicode表) => 010_010101 xxxxxxxx = 101 xx => 0x63 0xXX
   * 例) aaaaaaaaaaaaaaaaaaaaaaaa => 0x78 0x18(長さ) 0x61 0x61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61(unicode表) => 011_11000 000_11000 xxxxxxxx = 101 xx => 0x63 0xXX
   * @param str
   */
  static stringEncode(str: string) {
    const length = str.length;
    if (length < 24) {
      const b = Buffer.allocUnsafe(length + 1);
      b.writeUInt8(length | this.shiftedMajorType, 0);
      b.write(str, 1);
      return b;
    } else if (length === 24) {
      // no op
    }
  }
}
