import {
  detectCborTypeFromBaseCbor,
  throwableDecode,
  BaseCborType,
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
  static decode(cbor: BaseCborType): any[] {
    const result: any[] = [];
    const definedToken = detectCborTypeFromBaseCbor(cbor);
    if (cbor.type === "tiny") {
      throw new Error("配列はshort or long. wiki間違ってる");
    }
    switch (definedToken.type) {
      case "short": {
        // additinal infoに長さが入っており、次のbyte以降にデータ
        if (definedToken.additionalInformation > 23) {
          throw new Error("not tiny");
        }

        if (definedToken.additionalInformation === 0) {
          return [];
        }

        let eating = null;
        for (;;) {
          const eatResult = throwableDecode(eating || definedToken.variable);
          eating = eatResult.restCborString;
          result.push(eatResult.decodeResult);
          if (eatResult.restCborString === null) {
            break;
          }
        }

        if (result.length !== definedToken.additionalInformation) {
          throw new Error("additional informationと配列の数があってない");
        }

        return result;
      }

      case "long": {
        let eating2 = null;
        for (;;) {
          const eatResult = throwableDecode(eating2 || definedToken.variable);
          eating2 = eatResult.restCborString;
          result.push(eatResult.decodeResult);
          if (eatResult.restCborString === null) {
            break;
          }
        }
        return result;
      }
    }
    throw new Error("un reach");
  }
}
