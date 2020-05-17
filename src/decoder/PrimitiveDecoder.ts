import { BaseCborType, detectCborTypeFromBaseCbor } from "../helper";

/**
 * 正の数のdecoder
 */
export class PrimitiveDecoder {
  /**
   * 正の数であることが保証されたCBOR文字列からnumberを作る関数.
   *
   * @param cbor CBOR文字列.
   * @param dataItemHeader CBOR文字列の先頭1byte. major typeと追加情報が格納されている.
   * @returns 正の数
   */
  static decode(cbor: BaseCborType): boolean | null | undefined {
    const definedToken = detectCborTypeFromBaseCbor(cbor);
    if (definedToken.type !== "tiny") {
      // 一応tinyじゃないケースもあるがいまは無視
      throw new Error("primitiveは全部tiny");
    }
    if (cbor.additionalInformation === 20) {
      return false;
    } else if (cbor.additionalInformation === 21) {
      return true;
    } else if (cbor.additionalInformation === 22) {
      return null;
    } else if (cbor.additionalInformation === 23) {
      return undefined;
    }
  }
}
