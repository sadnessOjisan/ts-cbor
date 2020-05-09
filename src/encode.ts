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
  const numberMajorType = mejorType.unsignedInteger.type;
  const m = numberMajorType << 5;
  if (input >= 0) {
    // 符号なし
    if (input < 24) {
      // FIXME: 桁数大きいし16進数で比較した方が見やすいかも
      const encoded = encodeToUint8(input);
      console.log("encodeNumber", encoded);
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
      return encodeToUint8(input | 24) && encodeToUint8(input);
    } else if (input < 4294967295) {
      // no op
    } else if (input < Number.MAX_SAFE_INTEGER) {
      // no op
    }
  } else {
    // 符号あり
  }
  return Buffer.alloc(1);
};

const encodeToUint8 = (num: number) => {
  const b = Buffer.allocUnsafe(1);
  b.writeUInt8(num, 0); // 8ビット符合無し整数を0オフセットで書き込む
  return b;
};

const encodeBigint = (objs: any) => {
  const encoded = "hogehoge";
  return encoded;
};

const encodeString = (objs: any) => {
  const encoded = "hogehoge";
  return encoded;
};

const encodeBoolean = (objs: any) => {
  const encoded = "hogehoge";
  return encoded;
};

const encodeUndefined = (objs: any) => {
  const encoded = "hogehoge";
  return encoded;
};

const encodeObject = (objs: any) => {
  const encoded = "hogehoge";
  return encoded;
};
