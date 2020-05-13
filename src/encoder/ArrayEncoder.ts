/**
 * @file primitiveのエンコード. エンコードルールは https://tools.ietf.org/html/rfc7049#section-2.1 のMajor Type 7を参照.
 */

import { majorType } from "../const";
import { Encoder } from "./Encoder";

/**
 * 配列のエンコード関数をまとめたクラス.
 * Major Typeは4.
 */
export class ArrayEncoder {
  /**
   * 1byteで表現されるdata item headerの先頭3bit.
   * 8bitあるうちの先頭3bitにcategory typeを持ってきたいのでmajor typeを5bitシフトさせる.
   */
  static shiftedMajorType = majorType.array.type << 5;

  /**
   * primitiveのencodeを行う.
   * @param num primitiveを表す数値
   */
  static arrayEncode(arr: any[]) {
    const length = arr.length;
    if (length < 24) {
      const dataItemHeader = this.shiftedMajorType | length;
      let b = Buffer.allocUnsafe(length);
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      for (const a of arr) {
        b = Buffer.concat([b, Encoder.encodeAny(a)]);
      }
      return b;
    } else if (length < 256) {
    } else if (length < 65536) {
    } else if (length < 4294967296) {
    } else if (length < Number.MAX_SAFE_INTEGER) {
    }
  }
}
