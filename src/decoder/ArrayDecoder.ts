import { Decoder } from ".";
import { DataItemHeader } from "../const";
import {
  trimFirstHexFromCBOR,
  separateTokenFromCBOR,
  SeparatedCborType,
} from "../helper";

/**
 * 配列のdecoder
 */
export class ArrayDecoder {
  /**
   * 配列であることが保証されたCBOR文字列から配列を作る関数.
   *
   * @param cbor CBOR文字列.
   * @param dataItemHeader CBOR文字列の先頭1byte. major typeと追加情報が格納されている.
   */
  static decode(cbor: string, dataItemHeader: DataItemHeader): any[] {
    const result: any[] = [];
    if (dataItemHeader.addedInfo < 24) {
      for (let cnt = 0; cnt < dataItemHeader.addedInfo; cnt++) {
        const separatedToken = separateTokenFromCBOR(cbor);
        result.push(this.throwableDecode(separatedToken));
      }
      return result;
    } else if (dataItemHeader.addedInfo === 24) {
      return result;
    } else if (dataItemHeader.addedInfo === 25) {
      return result;
    } else if (dataItemHeader.addedInfo === 26) {
      return result;
    } else if (dataItemHeader.addedInfo === 27) {
      return result;
    }
    throw new Error("Invalid addedInfo");
  }

  /**
   * 渡されたtokenをJSのデータ構造に変換していく。
   * もしそのtokenがCBORとして不適切であれば残りのCBOR文字列から1tokenを切り出してそれを連結した新しいtokenでdecodeする。
   * @param separatedCborObject 先頭のtokenとその残りへと分離されたCBORオブジェクト
   * @returns JSのデータ構造
   */
  static throwableDecode(separatedCborObject: SeparatedCborType) {
    try {
      return Decoder.decode(separatedCborObject.token);
    } catch {
      // CBOR文字列じゃないときに実行. さらにtokenを読み進める
      if (!separatedCborObject.rest) {
        throw new Error("これ以上CBOR文字列を読み込めない");
      }
      const nextToken = trimFirstHexFromCBOR(separatedCborObject.rest);
      const tokenWithNextToken = separatedCborObject.token + nextToken;
      return Decoder.decode(tokenWithNextToken);
    }
  }
}
