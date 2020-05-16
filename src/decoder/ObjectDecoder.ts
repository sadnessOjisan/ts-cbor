import {
  CborType,
  detectCborTypeFromBaseCbor,
  separateTokenFromCBOR,
  SeparatedCborType,
  trimFirstHexFromCBOR,
} from "../helper";
import { Decoder } from "./old";

export class ObjectDecoder {
  /**
   * オブジェクトであることが保証されたCBOR文字列から配列を作る関数.
   *
   * @param cbor CBOR文字列.
   * @param dataItemHeader CBOR文字列の先頭1byte. major typeと追加情報が格納されている.
   */
  static decode(cbor: CborType): Object {
    const result = {};
    const definedToken = detectCborTypeFromBaseCbor(cbor);
    if (cbor.type === "tiny") {
      throw new Error("オブジェクトはshort or long. wiki間違ってる");
    }
    switch (definedToken.type) {
      case "short":
        // additinal infoに長さが入っており、次のbyte以降にデータ
        for (let cnt = 0; cnt < definedToken.additionalInformation; cnt++) {
          const firstResult = this.throwableDecode(cbor.raw);
          const key = firstResult.decodeResult;
          const secondResult = this.throwableDecode(firstResult.restCborString);
          const value = secondResult.decodeResult;
          result[key] = value;
        }
        return result;
      case "long":
        // 次のbyteに長さが入っている、その次のbyte以降にデータ
        // TODO: impl
        return result;
    }
  }

  /**
   * 渡されたtokenをJSのデータ構造に変換していく。
   * もしそのtokenがCBORとして不適切であれば残りのCBOR文字列から1tokenを切り出してそれを連結した新しいtokenでdecodeする。
   * @param cborString CBOR文字列
   * @returns JSのデータ構造
   */
  static throwableDecode(cborString: string) {
    const separatedCborObject = separateTokenFromCBOR(cborString);
    try {
      const targetToken = separatedCborObject.token;
      const decoded = Decoder.decode(separatedCborObject.token);
      const rest = cborString.slice(targetToken.length);
      return {
        decodeResult: decoded,
        restCborString: rest,
      };
    } catch {
      // CBOR文字列じゃないときに実行. さらにtokenを読み進める
      if (!separatedCborObject.rest) {
        throw new Error("これ以上CBOR文字列を読み込めない");
      }
      const nextToken = trimFirstHexFromCBOR(separatedCborObject.rest);
      const tokenWithNextToken = separatedCborObject.token + nextToken;
      const decoded = Decoder.decode(tokenWithNextToken);
      const rest = cborString.slice(tokenWithNextToken.length);
      return {
        decodeResult: decoded,
        restCborString: rest,
      };
    }
  }
}
