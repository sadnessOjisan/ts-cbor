import { Decoder } from ".";
import { DataItemHeader } from "../const";
import {
  trimFirstHexFromCBOR,
  separateTokenFromCBOR,
  SeparatedCborType,
  CborType,
  BaseCborType,
  detectCborTypeFromBaseCbor,
} from "../helper";

/**
 * 正の数のdecoder
 */
export class PositiveNumberDecoder {
  /**
   * 正の数であることが保証されたCBOR文字列からnumberを作る関数.
   *
   * @param cbor CBOR文字列.
   * @param dataItemHeader CBOR文字列の先頭1byte. major typeと追加情報が格納されている.
   * @returns 正の数
   */
  static decode(cbor: BaseCborType): number {
    const tinyCbor = detectCborTypeFromBaseCbor(cbor);
    if (tinyCbor.type !== "tiny") {
      throw new Error("tinyであるはず");
    }
    if (cbor.additionalInformation < 24) {
      return cbor.additionalInformation;
    } else {
      const separatedCborObject = separateTokenFromCBOR(cbor.raw);
      if (!separatedCborObject.rest) {
        throw new Error("読み込む対象が存在しない");
      }
      const hexValue = separatedCborObject.rest;
      return parseInt(hexValue, 16);
    }
  }
}
