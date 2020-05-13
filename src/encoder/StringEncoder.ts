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
   * 受け取った文字列をCBORに変換する。
   * data item headerはmajor typeと長さの情報を入れる。
   * 長さが23までならそのままdata item headerにそのまま長さを入れる。
   * 長さが24より大きくなるなら data item header の次のバイトで長さを指定する。
   * 2^8以上の長さがあり足りない場合は、必要に応じて次のbyteを使っていく。
   * FYI: https://en.wikipedia.org/wiki/CBOR
   *
   * 例) a => 61 61(unicode表) => 011_00011 xxxxxxxx = 99 xx
   * 例) aaa => 63 61(unicode表) 61 61 => 011_00100 xxxxxxxx = 101 xx
   * 例) aaaaaaaaaaaaaaaaaaaaaaa => 77 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61(unicode表) => 010_010101 xxxxxxxx = 101 xx => 0x63 0xXX
   * 例) aaaaaaaaaaaaaaaaaaaaaaaa => 0x78 0x18(長さ) 0x61 0x61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61(unicode表) => 011_11000 000_11000 xxxxxxxx = 101 xx => 0x63 0xXX
   * @param str 変換したい文字列
   * @returns Buffer バイト列
   */
  static stringEncode(str: string) {
    const byteLength = encodeURIComponent(str).replace(/%../g, "x").length;
    if (byteLength < 24) {
      const b = Buffer.allocUnsafe(byteLength + 1);
      b.writeUInt8(byteLength | this.shiftedMajorType, 0);
      b.write(str, 1);
      return b;
    } else if (byteLength < 256) {
      const b = Buffer.allocUnsafe(byteLength + 2);
      b.writeUInt8(this.shiftedMajorType | 24, 0);
      b.writeUInt8(byteLength, 1);
      b.write(str, 2);
      return b;
    } else if (byteLength < 65536) {
      const b = Buffer.allocUnsafe(byteLength + 3);
      b.writeUInt8(this.shiftedMajorType | 25, 0);
      b.writeUInt16BE(byteLength, 1);
      b.write(str, 3);
      return b;
    } else if (byteLength < 4294967296) {
      const b = Buffer.allocUnsafe(byteLength + 5);
      b.writeUInt8(this.shiftedMajorType | 26, 0);
      b.writeUInt32BE(byteLength, 1);
      b.write(str, 5);
      return b;
    } else if (byteLength < Number.MAX_SAFE_INTEGER) {
      const b = Buffer.allocUnsafe(byteLength + 9);
      b.writeUInt8(this.shiftedMajorType | 27, 0);
      b.writeBigInt64BE(BigInt(byteLength), 1);
      b.write(str, 9);
      return b;
    }
    throw new Error("unreach");
  }
}
