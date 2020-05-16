import { Decoder } from ".";
import { DataItemHeader } from "../const";
import {
  trimFirstHexFromCBOR,
  separateTokenFromCBOR,
  SeparatedCborType,
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
  static decode(cbor: string, dataItemHeader: DataItemHeader): number {
    if (dataItemHeader.addedInfo < 24) {
      return dataItemHeader.addedInfo;
    } else {
      const separatedCborObject = separateTokenFromCBOR(cbor);
      if (!separatedCborObject.rest) {
        throw new Error("読み込む対象が存在しない");
      }
      const hexValue = separatedCborObject.rest;
      return parseInt(hexValue, 16);
    }
  }
}
