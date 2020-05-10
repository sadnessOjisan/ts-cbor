import { mejorType } from "./const";

/**
 * cbor形式に変換する関数
 * @param input JSのデータ構造なんでも
 * @returns cbor形式
 */
export const encode = (input: any) => {
  return Uint8Array.from(encodeAny(input));
};

/**
 * 型に応じたエンコードをする関数
 * @param obj
 */
const encodeAny = (obj: any): Buffer => {
  switch (typeof obj) {
    case "number":
      return encodeNumber(obj);
    // case "bigint":
    //   return encodeBigint(obj);
    // case "string":
    //   // byte, string
    //   return encodeString(obj);
    // case "boolean":
    //   return encodeBoolean(obj);
    // case "undefined":
    //   return encodeUndefined(obj);
    // case "object":
    //   // json, array, null
    //   return encodeObject(obj);
    default:
      throw new Error();
  }
};

/**
 * 整数をエンコードする関数
 * @param input
 */
export const encodeNumber = (input: number) => {
  const numberMajorType =
    input > 0 ? mejorType.unsignedInteger.type : mejorType.negativeInteger.type;
  const m = numberMajorType << 5;
  if (input >= 0) {
    // 符号なし
    if (input < 24) {
      // FIXME: 桁数大きいし16進数で比較した方が見やすいかも
      return PositiveEncoder.ai023encode(input);
    } else if (input < 256) {
      return PositiveEncoder.ai24encode(input);
    } else if (input < 65536) {
      return PositiveEncoder.ai25encode(input);
    } else if (input < 4294967296) {
      return PositiveEncoder.ai26encode(input);
    } else if (input < Number.MAX_SAFE_INTEGER) {
      return PositiveEncoder.ai27encode(input);
    }
    throw new Error("unreached");
  } else {
    // 符号あり
    const newInput = -1 * input - 1;
    if (input > -24) {
      return PositiveEncoder.ai023encode(m | newInput);
    } else if (input > -256) {
      const b = Buffer.allocUnsafe(2);
      b.writeUInt8(m | 24, 0);
      b.writeUInt8(newInput, 1);
      return b;
    } else if (input > -65536) {
      const b = Buffer.allocUnsafe(3);
      b.writeUInt8(m | 25, 0);
      b.writeUInt16BE(newInput, 1);
      return b;
    } else if (input > -4294967296) {
      const b = Buffer.allocUnsafe(5);
      b.writeUInt8(m | 26, 0);
      b.writeUInt32BE(newInput, 1);
      return b;
    } else if (newInput < Number.MAX_SAFE_INTEGER) {
      const SHIFT32 = 0x100000000;
      const b = Buffer.allocUnsafe(9);
      b.writeUInt8(m | 27, 0);
      b.writeUInt32BE(Math.floor(newInput / SHIFT32), 1);
      b.writeUInt32BE(newInput % SHIFT32, 5);
      return b;
    }
    throw new Error("unreached");
  }
};

export const encodeToUint16 = (num: number) => {
  const b = Buffer.allocUnsafe(2);
  b.writeUInt16BE(num, 0);
  return b;
};

/**
 * 自然数のエンコード関数をまとめたクラス
 */
class PositiveEncoder {
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
   * uint32_tで書き込む
   * @param num
   */
  static ai27encode(num: number) {
    const b = Buffer.allocUnsafe(9);
    b.writeUInt8(27, 0);
    b.writeBigInt64BE(BigInt(num), 1);
    return b;
  }
}

// const encodeBigint = (objs: any) => {
//   const encoded = "hogehoge";
//   return encoded;
// };

// const encodeString = (objs: any) => {
//   const encoded = "hogehoge";
//   return encoded;
// };

// const encodeBoolean = (objs: any) => {
//   const encoded = "hogehoge";
//   return encoded;
// };

// const encodeUndefined = (objs: any) => {
//   const encoded = "hogehoge";
//   return encoded;
// };

// const encodeObject = (objs: any) => {
//   const encoded = "hogehoge";
//   return encoded;
// };
