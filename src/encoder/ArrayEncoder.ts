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
      let b = Buffer.allocUnsafe(1);
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      for (const a of arr) {
        b = Buffer.concat([b, Encoder.encodeAny(a)]);
      }
      return b;
    } else if (length < 256) {
      const dataItemHeader = this.shiftedMajorType | 24;
      let b = Buffer.allocUnsafe(2); // 先頭1bybeにadditional info, 次の1byteに長さを入れる. FIXME: magic number
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      b.writeUInt8(length, 1);
      for (const a of arr) {
        console.log(Buffer.concat([b, Encoder.encodeAny(a)]));
        b = Buffer.concat([b, Encoder.encodeAny(a)]);
      }

      return b;
    } else if (length < 65536) {
      const dataItemHeader = this.shiftedMajorType | 25; // FIXME: magic number
      let b = Buffer.allocUnsafe(3); // 先頭1bybeにadditional info, 次の2byteに長さを入れる. FIXME: magic number
      b.writeUInt8(dataItemHeader, 0);
      b.writeUInt16BE(length, 1); // FIXME: magic number
      for (const a of arr) {
        b = Buffer.concat([b, Encoder.encodeAny(a)]);
      }
      return b;
    } else if (length < 4294967296) {
      const dataItemHeader = this.shiftedMajorType | 26; // FIXME: magic number
      let b = Buffer.allocUnsafe(5); // 先頭1bybeにadditional info, 次の2byteに長さを入れる. FIXME: magic number
      b.writeUInt8(dataItemHeader, 0);
      b.writeUInt32BE(length, 1); // FIXME: magic number
      for (const a of arr) {
        b = Buffer.concat([b, Encoder.encodeAny(a)]);
      }
      return b;
    } else if (length < Number.MAX_SAFE_INTEGER) {
      const dataItemHeader = this.shiftedMajorType | 27; // FIXME: magic number
      let b = Buffer.allocUnsafe(9); // 先頭1bybeにadditional info, 次の2byteに長さを入れる. FIXME: magic number
      b.writeUInt8(dataItemHeader, 0);
      b.writeBigInt64BE(BigInt(length), 1); // FIXME: magic number
      for (const a of arr) {
        b = Buffer.concat([b, Encoder.encodeAny(a)]);
      }
      return b;
    }
  }
}
