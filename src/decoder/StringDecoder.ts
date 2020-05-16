import { detectCborTypeFromBaseCbor, BaseCborType } from "../helper";

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
      case "long":
        const cborTokenArray = this.cborValueToArray(definedToken.variable);
        const URI = this.cborTokenArrayToURI(cborTokenArray);
        return decodeURIComponent(URI);
    }
  }

  /**
   * cbor文字列のvalue部分を配列に分割する関数
   */
  private static cborValueToArray(cborValue: string): string[] {}

  /**
   * cborのトークン配列をURIに変換する関数
   */
  private static cborTokenArrayToURI(cborTokenArray: string[]): string {
    return decodeURIComponent(
      cborTokenArray.reduce((p, c) => {
        return p + "%" + c.toString(16), "";
      })
    );
  }
}
