import { majorType } from "../const";

/**
 * 負数のエンコード関数をまとめたクラス.
 * Major Typeは1
 */
export class NegativeEncoder {
  /**
   * 1byteで表現されるdata item headerの先頭3bit.
   * 8bitあるうちの先頭3bitにcategory typeを持ってきたいのでmajor typeを5bitシフトさせる.
   */
  static shiftedMajorType = majorType.negativeInteger.type << 5;

  /**
   * 負の数を正の数に変換して-1をする関数。
   * integer.  The encoding follows the rules
      for unsigned integers (major type 0), except that the value is
      then -1 minus the encoded unsigned integer.
   * @param num 変換したい数
   */
  static convertToPositableNumber(num: number) {
    if (num >= 0) {
      throw new Error("arg is not negative number");
    }
    return -1 * num - 1;
  }

  /**
   * encodeしたCBORのadditional informationが0-23になるように変換する.
   * major type1としたとき取りうるadditional informationに対応する数は-24まで.
   * (ex) 001 00000 ~ 001 10111
   * @param num -1 ~ -24の数
   * @returns Buffer
   */
  static ai023encode(num: number) {
    if (!(num < 0 && num > -25)) throw new Error("invalid input error");
    const input = this.convertToPositableNumber(num);
    const dataItemHeader = this.shiftedMajorType | input; // major typeの後に続く5bitをくっつける
    const b = Buffer.allocUnsafe(1);
    b.writeUInt8(dataItemHeader, 0);
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが24になるように変換する.
   * major type1としたとき取りうるadditional informationに対応する数は-25 ~ -255まで.
   * 先頭のbyteにデータ構造, 続くbyteにデータがuint8_tで書き込まれる。(合計で2byte)
   * (ex) 001 11000 xxxxxxxx
   * @param num -25 ~ -255の数
   * @returns Buffer
   */
  static ai24encode(num: number) {
    if (!(num <= -25 && num > -256)) throw new Error("invalid input error");
    const input = this.convertToPositableNumber(num);
    const dataItemHeader = this.shiftedMajorType | 24; // major typeに続くbitは24であるためビットシフト
    const b = Buffer.allocUnsafe(2);
    b.writeUInt8(dataItemHeader, 0); // byte列の最初でmajor typeとadditional infoを指定
    b.writeUInt8(input, 1); // 続くbyteに値を書き込む
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが25になるように変換する.
   * major type1としたとき取りうるadditional informationに対応する数は-256 ~ -65535まで.
   * 先頭のbyteにデータ構造, 続く2byteにデータがuint16_tで書き込まれる。(合計で3byte)
   * @param num
   */
  static ai25encode(num: number) {
    if (!(num <= -256 && num > -65536)) throw new Error("invalid input error");
    const input = this.convertToPositableNumber(num);
    const dataItemHeader = this.shiftedMajorType | 25; // major typeに続くbitは25であるためビットシフト
    const b = Buffer.allocUnsafe(3);
    b.writeUInt8(dataItemHeader, 0);
    b.writeUInt16BE(input, 1);
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが26になるように変換する.
   * major type1としたとき取りうるadditional informationに対応する数は-65536 ~ -4294967295 まで.
   * 先頭のbyteにデータ構造, 続く4byteにデータがuint32_tで書き込まれる。(合計で5byte)
   * @param num
   */
  static ai26encode(num: number) {
    if (!(num <= -65536 && num > -4294967296))
      throw new Error("invalid input error");
    const input = this.convertToPositableNumber(num);
    const dataItemHeader = this.shiftedMajorType | 26; // major typeに続くbitは26であるためビットシフト
    const b = Buffer.allocUnsafe(5);
    b.writeUInt8(dataItemHeader, 0);
    b.writeUInt32BE(input, 1);
    return b;
  }

  /**
   * encodeしたCBORのadditional informationが27になるように変換する.
   * major type1としたとき取りうるadditional informationに対応する数は-4294967295 ~ -9007199254740991.
   * 先頭のbyteにデータ構造, 続く8byteにデータがuint64_tで書き込まれる。(合計で9byte)
   * @param num
   */
  static ai27encode(num: number) {
    if (!(num <= -4294967297 && num >= -Number.MAX_SAFE_INTEGER))
      throw new Error("invalid input error");
    const input = this.convertToPositableNumber(num);
    const dataItemHeader = this.shiftedMajorType | 27; // major typeに続くbitは27であるためビットシフト
    const b = Buffer.allocUnsafe(9);
    b.writeUInt8(dataItemHeader, 0);
    b.writeBigInt64BE(BigInt(input), 1);
    return b;
  }
}
