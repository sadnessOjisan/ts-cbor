import {
  detectCborTypeFromBaseCbor,
  BaseCborType,
  throwableDecode,
} from "../helper";

export class ObjectDecoder {
  /**
   * オブジェクトであることが保証されたCBOR文字列から配列を作る関数.
   *
   * @param cbor CBOR文字列.
   * @param dataItemHeader CBOR文字列の先頭1byte. major typeと追加情報が格納されている.
   */
  static decode(cbor: BaseCborType): Record<string, any> {
    let result = {};
    const definedToken = detectCborTypeFromBaseCbor(cbor);
    if (cbor.type === "tiny") {
      throw new Error("オブジェクトはshort or long. wiki間違ってる");
    }
    switch (definedToken.type) {
      case "short": {
        // additinal infoに長さが入っており、次のbyte以降にデータ
        let eating = null;
        for (let cnt = 0; cnt < definedToken.additionalInformation; cnt++) {
          const firstResult = throwableDecode(eating || definedToken.variable);
          const key = firstResult.decodeResult;
          if (!firstResult.restCborString) {
            throw new Error("オブジェクトなので絶対に後続があるはず");
          }
          console.log("[ObjectDecoder]<decode> firstResult", firstResult);
          const secondResult = throwableDecode(firstResult.restCborString);
          const value = secondResult.decodeResult;
          eating = secondResult.restCborString;
          result = { ...result, [key]: value };
          console.log("[ObjectDecoder]<decode> eating", eating);
          console.log("[ObjectDecoder]<decode> secondResult", secondResult);

          console.log("[ObjectDecoder]<decode> definedToken", definedToken);
          console.log("[ObjectDecoder]<decode> result", result);
        }
        if (Object.keys(result).length !== definedToken.additionalInformation) {
          throw new Error("key数とadditional infoの数があってない");
        }
        return result;
      }
      case "long": {
        // payloadLengthに長さが入っている、それをvariableでまわす
        let eating = null;
        for (let cnt = 0; cnt < definedToken.payloadLength; cnt++) {
          const firstResult = throwableDecode(eating || definedToken.variable);
          const key = firstResult.decodeResult;
          if (!firstResult.restCborString) {
            throw new Error("オブジェクトなので絶対に後続があるはず");
          }
          const secondResult = throwableDecode(firstResult.restCborString);
          const value = secondResult.decodeResult;
          eating = secondResult.restCborString;
          result = { ...result, [key]: value };
        }
        if (Object.keys(result).length !== definedToken.additionalInformation) {
          throw new Error("key数とadditional infoの数があってない");
        }
        return result;
      }
    }
    throw new Error("unreach");
  }
}
