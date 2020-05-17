import { toCBOR } from "../helper";
import { ArrayDecoder } from "./ArrayDecoder";
import { PositiveNumberDecoder } from "./PositiveNumberDecoder";
import { NegativeNumberDecoder } from "./NegativeNumberDecoder";
import { StringDecoder } from "./StringDecoder";
import { ObjectDecoder } from "./ObjectDecoder";

export class Decoder {
  /**
   * CBOR列からJSのデータ構造に変換する関数
   * @param cborInputString {string} cbor文字列
   * 6161
   * 01
   * @example
   * const result = decode("6161")
   * // a
   * @throws CBOR文字列ではないときに例外を投げる
   */
  static decode(cborInputString: string): any {
    const cbor = toCBOR(cborInputString);
    const { majorType } = cbor;
    switch (majorType) {
      case 0:
        // 正の数
        return PositiveNumberDecoder.decode(cbor);
      case 1:
        // 負の数
        return NegativeNumberDecoder.decode(cbor);
      case 2:
        // Buffer
        throw new Error("first releaseではサポートしない");
      case 3:
        // 文字列
        return StringDecoder.decode(cbor);
      case 4:
        // 配列
        return ArrayDecoder.decode(cbor);
      case 5:
        // オブジェクト
        return ObjectDecoder.decode(cbor);
      case 6:
        // tag
        throw new Error("first releaseではサポートしない");
      case 7:
        // primitive(null, undefined, false, true)
        console.log("<decode>cbor", cbor);
        throw new Error("first releaseではサポートしない");
        break;
      default:
        throw new Error("Invalid CBOR Input");
    }
  }
}
