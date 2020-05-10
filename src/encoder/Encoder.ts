import { PositiveEncoder } from "./PositiveEncoder";
import { NegativeEncoder } from "./NegativeEncoder";

/**
 * エンコーダー. JSのデータ構造をcbor形式に変換する
 */
export class Encoder {
  /**
   * cbor形式に変換する関数
   *
   * TODO: 何形式で返すかは悩み中
   * @param input JSのデータ構造なんでも
   * @returns cbor形式
   */
  static encode(input: any) {
    return this.encodeAny(input);
    //   return Uint8Array.from(encodeAny(input));
  }

  /**
   * 型に応じたエンコードをする関数
   * @param obj
   */
  static encodeAny(obj: any): Buffer {
    switch (typeof obj) {
      case "number":
        return this.encodeNumber(obj);
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
  }

  /**
   * 整数をエンコードする関数
   * @param input
   */
  static encodeNumber(input: number) {
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
      if (input > -24) {
        return NegativeEncoder.ai023encode(input);
      } else if (input > -256) {
        return NegativeEncoder.ai24encode(input);
      } else if (input > -65536) {
        return NegativeEncoder.ai25encode(input);
      } else if (input > -4294967296) {
        return NegativeEncoder.ai26encode(input);
      } else if (input > -Number.MAX_SAFE_INTEGER) {
        return NegativeEncoder.ai27encode(input);
      }
      throw new Error("unreached");
    }
  }
}
