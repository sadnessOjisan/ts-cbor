/**
 * @file Objectのエンコード. エンコードルールは https://tools.ietf.org/html/rfc7049#section-2.1 のMajor Type 7を参照.
 */

import { majorType } from "../const";
import { Encoder } from "./Encoder";

/**
 * 配列のエンコード関数をまとめたクラス.
 * Major Typeは4.
 */
export class ObjectEndocer {
  /**
   * 1byteで表現されるdata item headerの先頭3bit.
   * 8bitあるうちの先頭3bitにcategory typeを持ってきたいのでmajor typeを5bitシフトさせる.
   */
  static shiftedMajorType = majorType.object.type << 5;

  /**
   * Objectのencodeを行う.
   * @param num Objectを表す数値
   */
  static encodeObject(obj: Record<string, any>) {
    const keyLength = Object.keys(obj).length;
    if (keyLength < 24) {
      const dataItemHeader = this.shiftedMajorType | keyLength;
      let b = Buffer.allocUnsafe(1);
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      Object.keys(obj).forEach((key: string) => {
        b = Buffer.concat([b, Encoder.encodeAny(key)]);
        // @ts-ignore
        b = Buffer.concat([b, Encoder.encodeAny(obj[key])]);
      });
      return b;
    } else if (keyLength < 256) {
      const dataItemHeader = this.shiftedMajorType | 24;
      let b = Buffer.allocUnsafe(2);
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      b.writeUInt8(keyLength, 1);
      Object.keys(obj).forEach((key: string) => {
        b = Buffer.concat([b, Encoder.encodeAny(key)]);
        // @ts-ignore
        b = Buffer.concat([b, Encoder.encodeAny(obj[key])]);
      });
      return b;
    } else if (keyLength < 65536) {
      const dataItemHeader = this.shiftedMajorType | 25;
      let b = Buffer.allocUnsafe(3);
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      b.writeUInt16BE(keyLength, 1);
      Object.keys(obj).forEach((key: string) => {
        b = Buffer.concat([b, Encoder.encodeAny(key)]);
        // @ts-ignore
        b = Buffer.concat([b, Encoder.encodeAny(obj[key])]);
      });
      return b;
    } else if (keyLength < 4294967296) {
      const dataItemHeader = this.shiftedMajorType | 26;
      let b = Buffer.allocUnsafe(5);
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      b.writeUInt32BE(keyLength, 1);
      Object.keys(obj).forEach((key: string) => {
        b = Buffer.concat([b, Encoder.encodeAny(key)]);
        // @ts-ignore
        b = Buffer.concat([b, Encoder.encodeAny(obj[key])]);
      });
      return b;
    } else if (keyLength < Number.MAX_SAFE_INTEGER) {
      const dataItemHeader = this.shiftedMajorType | 27;
      let b = Buffer.allocUnsafe(5);
      b.writeUInt8(dataItemHeader, 0); // FIXME: magic number
      b.writeBigUInt64BE(BigInt(keyLength), 1);
      Object.keys(obj).forEach((key: string) => {
        b = Buffer.concat([b, Encoder.encodeAny(key)]);
        // @ts-ignore
        b = Buffer.concat([b, Encoder.encodeAny(obj[key])]);
      });
      return b;
    }
    throw new Error("unreach");
  }
}
