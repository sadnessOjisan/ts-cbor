import {
  MAJOR_TYPE_IDENTIFIER_TYPE,
  majorTypeIdentifiers,
  DataItemHeader,
} from "../const";
import { trimFirstHexFromCBOR, hexToDateitemHeader } from "../helper";
import { ArrayDecoder } from "./ArrayDecoder";
import { PositiveNumberDecoder } from "./PositiveNumberDecoder";
import { NegativeNumberDecoder } from "./NegativeNumberDecoder";

export class Decoder {
  /**
   * CBOR列からJSのデータ構造に変換する関数
   * @param cbor {string} cbor文字列
   * 6161
   * 01
   * @example
   * const result = decode("6161")
   * // a
   * @throws CBOR文字列ではないときに例外を投げる
   */
  static decode(cbor: string) {
    const firstHexAsString = trimFirstHexFromCBOR(cbor);
    const firstHex = parseInt(firstHexAsString, 2);
    const dataHeaderItem = hexToDateitemHeader(firstHex);
    const { majorType } = dataHeaderItem;
    switch (majorType) {
      case 0:
        // 正の数
        return PositiveNumberDecoder.decode(cbor, dataHeaderItem);
        break;
      case 1:
        // 負の数
        return NegativeNumberDecoder.decode(cbor, dataHeaderItem);
      case 2:
        // Buffer
        break;
      case 3:
        // 文字列
        return NegativeNumberDecoder.decode();
        break;
      case 4:
        // 配列
        return ArrayDecoder.decode(cbor, dataHeaderItem);
      case 5:
        // オブジェクト
        break;
      case 6:
        // tag
        break;
      case 7:
        // primitive(null, undefined, false, true)
        break;
      default:
        throw new Error("Invalid CBOR Input");
    }
  }
}
