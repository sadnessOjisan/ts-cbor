import { Decoder } from ".";
import {
  trimFirstHexFromCBOR,
  SeparatedCborType,
  CborType,
  detectCborTypeFromBaseCbor,
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
  static decode(cbor: CborType): any[] {
    const result: any[] = [];
    const definedToken = detectCborTypeFromBaseCbor(cbor);
    if (cbor.type === "tiny") {
      throw new Error("配列はshort or long. wiki間違ってる");
    }
    switch (definedToken.type) {
      case "short":
        // additinal infoに長さが入っており、次のbyte以降にデータ
        for (let cnt = 0; cnt < definedToken.additionalInformation; cnt++) {
          // 配列にdecoded結果を詰め込む
        }
        return result;
      case "long":
        // 次のbyteに長さが入っている、その次のbyte以降にデータ
        for (let cnt = 0; cnt < definedToken.payloadLength; cnt++) {
          // 配列にdecoded結果を詰め込む
        }
        return result;
    }
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
