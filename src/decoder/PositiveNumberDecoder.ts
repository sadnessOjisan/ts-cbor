import {
  separateTokenFromCBOR,
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
    const definedToken = detectCborTypeFromBaseCbor(cbor);
    if (definedToken.additionalInformation < 24) {
      return definedToken.additionalInformation;
    } else {
      const separatedCborObject = separateTokenFromCBOR(definedToken.raw);
      if (!separatedCborObject.rest) {
        throw new Error("読み込む対象が存在しない");
      }
      const hexValue = separatedCborObject.rest;
      return parseInt(hexValue, 16);
    }
  }
}
