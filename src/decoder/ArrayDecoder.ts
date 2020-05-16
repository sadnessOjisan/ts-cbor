import {
  CborType,
  detectCborTypeFromBaseCbor,
  throwableDecode,
} from "../helper";

/**
 * 配列のdecoder
 */
export class ArrayDecoder {
  /**
   * 配列であることが保証されたCBOR文字列から配列を作る関数.
   *
   * @param cbor CBOR文字列.
   * ex) 820163E38182 = 82(array(2)) 01(1) 63(text(3byte)) E38182(あ) = [12, "あ"]
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
        if (definedToken.additionalInformation > 23) {
          throw new Error("not tiny");
        }
        let eating = null;
        while (true) {
          const eatResult = throwableDecode(eating || definedToken.raw);
          eating = result.restCborString;
          result.push(eatResult.decodeResult);
          if (eating === null) {
            break;
          }
        }
        return result;
      case "long":
        // 次のbyteに長さが入っている、その次のbyte以降にデータ
        while (true) {
          // TODO: 配列にdecoded結果を詰め込む
        }
        return result;
    }
  }
}
