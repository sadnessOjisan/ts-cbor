/**
 * @file 正数のエンコード. エンコードルールは https://tools.ietf.org/html/rfc7049#section-2.1 のMajor Type 0を参照.
 */

import { mejorType } from "../const";

/**
 * 自然数のエンコード関数をまとめたクラス.
 * Major Typeは0.
 */
export class PositiveEncoder {
  /**
   * 1byteで表現されるdata item headerの先頭3bit.
   * 8bitあるうちの先頭3bitにcategory typeを持ってきたいのでmajor typeを5bitシフトさせる.
   */
  static shiftedMajorType = mejorType.unsignedInteger.type << 5;

  /**
   * encodeしたCBORのadditional informationが0-23になるように変換する.
   * major type0としたとき取りうるadditional informationに対応する数は23まで.
   * (ex) 000 00000 ~ 000 10111
   * @param num 1 ~ 23の数
   * @returns Buffer
   */
  static ai023encode(num: number) {
    if (!(num >= 0 && num < 24)) throw new Error("invalid input error");
    // 0-23の場合はdataItemHeaderに直接データが書き込まれる
    const dataItemHeader = this.shiftedMajorType | num;
    const b = Buffer.allocUnsafe(1);
    b.writeUInt8(dataItemHeader, 0);
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが24になるように変換する.
   * major type0としたとき取りうるadditional informationに対応する数は24まで.
   * (ex) 00011000 xxxxxxxx
   * 先頭のbyteにデータ構造, 続くbyteにデータがuint8_tで書き込まれる。(合計で2byte)
   * @param num 24 ~ 255 の数
   * @returns Buffer
   */
  static ai24encode(num: number) {
    const b = Buffer.allocUnsafe(2);
    const dataItemHeader = this.shiftedMajorType | 24;
    b.writeUInt8(dataItemHeader, 0);
    b.writeUInt8(num, 1);
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが25になるように変換する.
   * major type0としたとき取りうるadditional informationに対応する数は25まで.
   * (ex) 00011001 xxxxxxxx
   * 先頭のbyteにデータ構造, 続くbyteにデータがuint16_tで書き込まれる。(合計で3byte)
   * @param num 256 ~ 65535 の数
   * @returns Buffer
   */
  static ai25encode(num: number) {
    const b = Buffer.allocUnsafe(3);
    const dataItemHeader = this.shiftedMajorType | 25;
    b.writeUInt8(dataItemHeader, 0);
    b.writeUInt16BE(num, 1);
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが26になるように変換する.
   * major type0としたとき取りうるadditional informationに対応する数は26まで.
   * (ex) 00011010 xxxxxxxx
   * 先頭のbyteにデータ構造, 続くbyteにデータがuint32_tで書き込まれる。(合計で5byte)
   * @param num 65536 ~ 4294967295 の数
   * @returns Buffer
   */
  static ai26encode(num: number) {
    const b = Buffer.allocUnsafe(5);
    const dataItemHeader = this.shiftedMajorType | 26;
    b.writeUInt8(dataItemHeader, 0);
    b.writeUInt32BE(num, 1);
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが27になるように変換する.
   * major type0としたとき取りうるadditional informationに対応する数は27まで.
   * (ex) 00011011 xxxxxxxx
   * 先頭のbyteにデータ構造, 続くbyteにデータがuint64_tで書き込まれる。(合計で9byte)
   * @param num 4294967296 ~ の数
   * @returns Buffer
   */
  static ai27encode(num: number) {
    const b = Buffer.allocUnsafe(9);
    const dataItemHeader = this.shiftedMajorType | 27;
    b.writeUInt8(dataItemHeader, 0);
    b.writeBigInt64BE(BigInt(num), 1);
    return b;
  }
}
