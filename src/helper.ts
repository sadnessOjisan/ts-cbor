import { MAJOR_TYPE_IDENTIFIER_TYPE, majorTypeIdentifiers } from "./const";
import { Decoder } from "./decoder";

export type SperatedFirstTokenCbor = {
  token: string;
  rest: string | null;
};

/**
 * CBOR文字列から最初に現れる16進数とそれ以降の文字列に分離する関数。
 * CBORに準拠したtokenは16進数にcastできる性質を利用している.
 * @param input CBOR文字列
 * * 626161
 * * 01
 * * 0
 * @returns SperatedFirstTokenCbor
 * 00は00のまま返してもいい。00であってもparseされたら0として出力される。
 *
 * @example
 * const firstHex = trimFirstHexFromCBOR("626161")
 * // { token: "62", rest: "6161" }
 *
 * const firstHex = trimFirstHexFromCBOR("01")
 * // { token: "01", rest: null }
 *
 * const firstHex = trimFirstHexFromCBOR("0")
 * // { token: "0", rest: null }
 */
export const separateTokenFromCBOR = (cbor: string): SperatedFirstTokenCbor => {
  const dataHeaderItem = cbor.slice(0, 3);
  // 010というパターンは01で受け取りたいので先頭に0が来ると弾くようにした
  if (parseInt(dataHeaderItem, 16) < 256 && dataHeaderItem[0] !== "0") {
    return {
      token: cbor.slice(0, 3),
      rest: cbor.slice(3) !== "" ? cbor.slice(3) : null,
    };
  } else {
    return {
      token: cbor.slice(0, 2),
      rest: cbor.slice(2) !== "" ? cbor.slice(2) : null,
    };
  }
};

/**
 * CBOR文字列から最初に現れる16進数を求める関数.
 * @param input CBOR文字列
 * * 6161
 * * 01
 *
 * @example
 * const firstHex = trimFirstHexFromCBOR("6161")
 * // 61 (6や616にならない)
 *
 * const firstHex = trimFirstHexFromCBOR("01")
 * // 01
 */
export const trimFirstHexFromCBOR = (input: string) => {
  return separateTokenFromCBOR(input).token;
};

export type DataItemHeader = {
  /** 最初の3bit */
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE;
  /** 次の5bit */
  additionalInformation: number;
};

/**
 * このライブラリ内でのCBOR表現.
 * データ構造に応じてtiny, short, longを使う.
 * undefinedはタイプが未定義なときに使う.(major typeによって変動しうるため)
 */
type CborIdentiferType = "tiny" | "short" | "long" | undefined;

/**
 * このライブラリ内に登場するCBOR表現の共通部分
 */
export type BaseCborType = {
  /** どのCBOR Typeか */
  type: CborIdentiferType;
  // 受け取ったCBOR文字列そのもの
  raw: string;
  /** major type */
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE;
  /** 23-31. TinyCborTypeにとってはこれが実質のvalue */
  additionalInformation: number;
  /** typeがlongのときだけ入る。それ以外の時の長さはadditionalInformationでも代用できる(配列・オブジェクト) */
  payloadLength?: number;
};

/**
 * BaseCborType型のオブジェクトを生成する関数. typeは未定義なのでundefinedで固定.
 * @param cborString
 * @param majorType
 * @param additionalInformation
 */
const ofBaseCbor = (
  cborString: string,
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE,
  additionalInformation: number
): BaseCborType => {
  return {
    type: undefined,
    raw: cborString,
    majorType,
    additionalInformation,
  };
};

/**
 * TinyCbor型.
 */
export type TinyCborType = BaseCborType & {
  type: "tiny";
};

/**
 * TinyCbor型のオブジェクトを生成する関数
 */
const ofTineCbor = (
  cborString: string,
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE,
  additionalInformation: number
): TinyCborType => {
  return {
    type: "tiny",
    raw: cborString,
    majorType,
    additionalInformation,
  };
};

/**
 * ShortType型.
 * @example
 * {
 *  type: "short",
    raw: 6161,
    majorType: 3,
    additionalInformation: 1,
    variable: 61
 * }
 */
export type ShortCborType = BaseCborType & {
  type: "short";
  /** CBOR文字列のうちmajorTypeとadditionalInformationとpayloadLengthを取り除いたもの */
  variable: string;
};

/**
 * ShortCbor型のオブジェクトを生成する関数
 * @param cborString
 * @param majorType
 * @param additionalInformation
 */
const ofShortField = (
  cborString: string,
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE,
  additionalInformation: number,
  variable: string
): ShortCborType => {
  return {
    type: "short",
    raw: cborString,
    majorType,
    additionalInformation,
    variable,
  };
};

/**
 * LongCbor型
 */

/**
 * LongCbor型
 * @example
 * {
 *  type: "short",
 *  // 78 18 616161616161616161616161616161616161616161616161
    raw: 7818616161616161616161616161616161616161616161616161,
    majorType: 3,
    additionalInformation: 24, // 0x18が長さ
    payloadLength: 24,
    // 0x78, 0x18 を取り除いた部分がvariable
    variable: 616161616161616161616161616161616161616161616161
 * }
 */
export type LongCborType = BaseCborType & {
  type: "long";
  /** variableに格納されているデータの長さ. numberがあればlong, なければshort */
  payloadLength: number;
  /** CBOR文字列のうちmajorTypeとadditionalInformationとpayloadLengthを取り除いたもの */
  variable: string;
};

/**
 * LongCbor型のオブジェクトを生成する関数
 * @param cborString
 * @param majorType
 * @param additionalInformation
 * @param payloadLength
 * @param variable
 */
const ofLongField = (
  cborString: string,
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE,
  additionalInformation: number,
  payloadLength: number,
  variable: string
): LongCborType => {
  return {
    type: "long",
    raw: cborString,
    majorType,
    additionalInformation,
    payloadLength,
    variable,
  };
};

/**
 * 未定義のCborTypeを鑑定する.
 * major typeによって取りうるcbor typeが異なってくる。
 *
 * 数字(majortypeが0, 1)のときは、additionalInformationが24以下ならtiny, それ以外はshort.
 * byte(majortypeが2)のときは、additionalInformationが24以下ならtiny, それ以外はlong.
 * string(majortypeが3)のときは、additionalInformationが24以下ならshort, それ以外はlong.
 * array, object(majortypeが4)のときは、additionalInformationが24以下ならshort, それ以外はlong.
 * @param undefinedTypeCbor undefinedが設定されたままのCBORオブジェクト
 */
export const detectCborTypeFromBaseCbor = (
  undefinedTypeCbor: BaseCborType
): CborType => {
  if (!undefinedTypeCbor.type === undefined) {
    throw new Error("鑑定済み");
  }
  switch (undefinedTypeCbor.majorType) {
    case 0:
    case 1:
      if (undefinedTypeCbor.additionalInformation < 24) {
        return ofTineCbor(
          undefinedTypeCbor.raw,
          undefinedTypeCbor.majorType,
          undefinedTypeCbor.additionalInformation
        );
      } else {
        const trimed = separateTokenFromCBOR(undefinedTypeCbor.raw);
        if (!trimed.rest) {
          throw new Error(
            "additional infoが24以上なら2byte目以降にもデータがある"
          );
        }
        return ofShortField(
          undefinedTypeCbor.raw,
          undefinedTypeCbor.majorType,
          undefinedTypeCbor.additionalInformation,
          trimed.rest
        );
      }
    case 2:
    case 3:
      // 文字列
      if (undefinedTypeCbor.additionalInformation < 24) {
        const variable = undefinedTypeCbor.raw.slice(2);
        return ofShortField(
          undefinedTypeCbor.raw,
          undefinedTypeCbor.majorType,
          undefinedTypeCbor.additionalInformation,
          variable
        );
      } else {
        const lengthHexString = undefinedTypeCbor.raw.slice(
          2,
          2 + (undefinedTypeCbor.additionalInformation - 23) * 2
        );
        const length = parseInt(lengthHexString, 16);
        const variable = undefinedTypeCbor.raw.slice(
          2 + (undefinedTypeCbor.additionalInformation - 23) * 2
        );
        return ofLongField(
          undefinedTypeCbor.raw,
          undefinedTypeCbor.majorType,
          undefinedTypeCbor.additionalInformation,
          length,
          variable
        );
      }
    case 4: // 配列はtinyはありえない(wiki間違ってる)
    case 5:
      if (undefinedTypeCbor.additionalInformation < 24) {
        const variable = undefinedTypeCbor.raw.slice(2);
        if (undefinedTypeCbor.additionalInformation > 0 && variable === "") {
          throw new Error(
            "空配列じゃない限り、shortならvariableに絶対何かの値があるはず"
          );
        }
        return ofShortField(
          undefinedTypeCbor.raw,
          undefinedTypeCbor.majorType,
          undefinedTypeCbor.additionalInformation,
          variable
        );
      } else {
        const lengthHexString = undefinedTypeCbor.raw.slice(
          2,
          2 + (undefinedTypeCbor.additionalInformation - 23) * 2
        );
        const length = parseInt(lengthHexString, 16);
        const variable = undefinedTypeCbor.raw.slice(
          2 + (undefinedTypeCbor.additionalInformation - 23) * 2
        );
        return ofLongField(
          undefinedTypeCbor.raw,
          undefinedTypeCbor.majorType,
          undefinedTypeCbor.additionalInformation,
          length,
          variable
        );
      }
    case 6:
      // TODO: 適切なCBORを返す
      return ofTineCbor(
        undefinedTypeCbor.raw,
        undefinedTypeCbor.majorType,
        undefinedTypeCbor.additionalInformation
      );
    case 7:
      // TODO: 適切なCBORを返す
      return ofTineCbor(
        undefinedTypeCbor.raw,
        undefinedTypeCbor.majorType,
        undefinedTypeCbor.additionalInformation
      );
    default:
      throw new Error("Invalid CBOR Input");
  }
};

/** このライブラリ内でのCBOR表現. */
export type CborType = TinyCborType | ShortCborType | LongCborType;

/**
 * 1byte(0-255)をdataItemHeaderに分解する。
 * @param input castすると16進数で表現できる文字列
 * @returns DataItemHeader
 */
export const hexToDateitemHeader = (input: number): DataItemHeader => {
  if (input < 0 || input > 255) {
    throw new Error("un expected input");
  }
  const majorType = (input >> 5) as MAJOR_TYPE_IDENTIFIER_TYPE;
  const additionalInformation = input & 0b00011111;
  if (!majorTypeIdentifiers.includes(majorType)) {
    throw new Error("unexpected major type");
  }
  return { majorType, additionalInformation };
};

/**
 * CBOR文字列から未鑑定のCBORオブジェクトを生成する。
 * @param cborInput CBOR文字列
 * ex) 6161
 * @returns 未鑑定(typeがundefined)のCBORオブジェクト
 * @example
 * const cbor = toCBOR("6161")
 * // {type: undefined, raw: "6161", majorType: 0, additionalInformation:1}
 */
export const toCBOR = (cborInput: string): BaseCborType => {
  const firstHexAsString = trimFirstHexFromCBOR(cborInput);
  const firstHex = parseInt(firstHexAsString, 16);
  const dataHeaderItem = hexToDateitemHeader(firstHex);
  const { majorType, additionalInformation } = dataHeaderItem;
  return ofBaseCbor(cborInput, majorType, additionalInformation);
};

/**
 * デコード結果
 */
type EatCborResutType = {
  /** デコードした結果 */
  decodeResult: any;
  /** その時点でのデコードでは不要だったCBOR文字列 */
  restCborString: string | null;
};

/**
 * 入力文字列がCBOR準拠かたしかめる
 * @param cborString
 */
export const isValidCborString = (cborString: string): boolean => {
  try {
    Decoder.decode(cborString);
    return true;
  } catch {
    return false;
  }
};

/**
 * 渡されたCBOR文字列に現れた最初のJS準拠のデータと残ったCBOR文字列を返す
 *
 * @param cborString CBOR文字列
 * @returns JSのデータ構造と、使いきれなかったtoken
 */
export const throwableDecode = (cborString: string): EatCborResutType => {
  let stri = trimFirstHexFromCBOR(cborString);
  while (!isValidCborString(stri)) {
    const nextToken = trimFirstHexFromCBOR(cborString.slice(stri.length));
    stri = cborString.slice(0, stri.length + nextToken.length);
    if (nextToken === "") {
      throw new Error("invalid");
    }
  }

  const rest = cborString.slice(stri.length);
  return {
    decodeResult: Decoder.decode(stri),
    restCborString: rest === "" ? null : rest,
  };
};
