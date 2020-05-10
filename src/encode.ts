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
 *
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
 * 1もらうと01返すような関数
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
      const encoded = encodeToUint8(input);
      return encoded;
    } else if (input < 256) {
      const res = [encodeToUint8(m | 24), encodeToUint8(input)];
      const result = Buffer.allocUnsafe(2);
      let offset = 0;
      for (let i = 0; i < res.length; i++) {
        const buffer = res[i];
        buffer.copy(result, offset, 0, buffer.length);
        offset += buffer.length;
      }
      return result;
    } else if (input < 65536) {
      const b = Buffer.allocUnsafe(3);
      b.writeUInt8(m | 25, 0);
      b.writeUInt16BE(input, 1);
      return b;
    } else if (input < 4294967296) {
      const b = Buffer.allocUnsafe(5);
      b.writeUInt8(m | 26, 0);
      b.writeUInt32BE(input, 1);
      return b;
    } else if (input < Number.MAX_SAFE_INTEGER) {
      const SHIFT32 = 0x100000000;
      const b = Buffer.allocUnsafe(9);
      b.writeUInt8(m | 27, 0);
      b.writeUInt32BE(Math.floor(input / SHIFT32), 1);
      b.writeUInt32BE(input % SHIFT32, 5);
      return b;
    }
  } else {
    // 符号あり
    const newInput = -1 * input - 1;
    if (input > -24) {
      const encoded = encodeToUint8(m | newInput);
      return encoded;
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
  }
  return Buffer.alloc(1);
};

const encodeToUint8 = (num: number) => {
  console.log("<encodeToUint8> num:", num);
  const b = Buffer.allocUnsafe(1);
  b.writeUInt8(num, 0); // 8ビット符合無し整数を0オフセットで書き込む
  return b;
};

export const encodeToUint16 = (num: number) => {
  const b = Buffer.allocUnsafe(2);
  b.writeUInt16BE(num, 0);
  return b;
};

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
