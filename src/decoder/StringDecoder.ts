import {
  detectCborTypeFromBaseCbor,
  BaseCborType,
  SperatedFirstTokenCbor,
  separateTokenFromCBOR,
} from "../helper";

/**
 * 文字列のdecoder
 */
export class StringDecoder {
  /**
   * 文字列であることが保証されたCBOR文字列から文字列を作る関数.
   *
   * @param cbor CBOR文字列. utf-8形式でそのまま連結されている。マルチバイト文字もそのままくっついている.
   * ex) aあ => 6461E38182 (64(string2文字) 61(a) E38182(あ))
   * @param dataItemHeader CBOR文字列の先頭1byte. major typeと追加情報が格納されている.
   */
  static decode(cbor: BaseCborType): string {
    const definedToken = detectCborTypeFromBaseCbor(cbor);
    switch (definedToken.type) {
      case "short":
        const cborTokenArray = this.cborValueToArray(definedToken.variable);
        const URI = this.cborTokenArrayToURI(cborTokenArray);
        const decoded = decodeURIComponent(URI);
        const decodedByteLength = encodeURIComponent(decoded).replace(
          /%../g,
          "x"
        ).length;
        if (decodedByteLength !== definedToken.additionalInformation) {
          throw new Error("長さあってない");
        }
        return decoded;
      case "long":
        const cborTokenArray2 = this.cborValueToArray(definedToken.variable);
        const URI2 = this.cborTokenArrayToURI(cborTokenArray2);
        const decoded2 = decodeURIComponent(URI2);
        const decodedByteLength2 = encodeURIComponent(decoded2).replace(
          /%../g,
          "x"
        ).length;
        if (decodedByteLength2 !== definedToken.payloadLength) {
          console.error(
            "definedToken.payloadLength",
            definedToken.payloadLength
          );
          throw new Error("長さあってない");
        }
        return decoded2;
    }
    throw new Error("un reach");
  }

  /**
   * cbor文字列のvalue部分を配列に分割する関数.
   * @param cborValue
   * 入力文字列. E38182E38182E38182 などのように 0xE3 0x81 0x82 0xE3 0x81 0x82 と16進数表記の文字列が渡される
   *
   */
  private static cborValueToArray(cborValue: string): string[] {
    // TODO:  Impl
    let res = [];
    // @ts-ignore あとで初期化される
    let trimed: SperatedFirstTokenCbor = {};
    while (true) {
      trimed = separateTokenFromCBOR(trimed.rest || cborValue);
      res.push(trimed.token);
      if (!trimed.rest) {
        break;
      }
    }
    return res;
  }

  /**
   * 16進数文字列の配列をURIに変換する関数
   * @param hexStringArray 16進数文字列の配列
   * ex) ["e3", "81", 82]
   */
  private static cborTokenArrayToURI(hexStringArray: string[]): string {
    const uri =
      "%" +
      hexStringArray.reduce((acc, value) => {
        return acc + "%" + value;
      });
    return uri;
  }
}
