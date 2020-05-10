/**
 * 自然数のエンコード関数をまとめたクラス
 */
export class PositiveEncoder {
  /**
   * additional informationが0-23の時の変換関数
   * そのままuint8_tで書き込む
   * @param num
   */
  static ai023encode(num: number) {
    const b = Buffer.allocUnsafe(1);
    b.writeUInt8(num, 0); // 8ビット符合無し整数を0オフセットで書き込む
    return b;
  }

  /**
   * additional informationが24の時の変換関数
   * uint8_tで書き込む
   * @param num
   */
  static ai24encode(num: number) {
    const b = Buffer.allocUnsafe(2);
    b.writeUInt8(24, 0);
    b.writeUInt8(num, 1);
    return b;
  }

  /**
   * additional informationが25の時の変換関数
   * uint16_tで書き込む
   * @param num
   */
  static ai25encode(num: number) {
    const b = Buffer.allocUnsafe(3);
    b.writeUInt8(25, 0);
    b.writeUInt16BE(num, 1);
    return b;
  }

  /**
   * additional informationが26の時の変換関数
   * uint32_tで書き込む
   * @param num
   */
  static ai26encode(num: number) {
    const b = Buffer.allocUnsafe(5);
    b.writeUInt8(26, 0);
    b.writeUInt32BE(num, 1);
    return b;
  }

  /**
   * additional informationが27の時の変換関数
   * uint64_tで書き込む
   * @param num
   */
  static ai27encode(num: number) {
    const b = Buffer.allocUnsafe(9);
    b.writeUInt8(27, 0);
    b.writeBigInt64BE(BigInt(num), 1);
    return b;
  }
}
