import { MAJOR_TYPE_IDENTIFIER_TYPE, majorTypeIdentifiers } from "./const";

export type SeparatedCborType = {
  token: string;
  rest: string | null;
};

/**
 * CBOR文字列から最初に現れる16進数とそれ以降の文字列に分離する関数。
 * CBORに現れる数は16進数であることを利用している。
 * @param input CBOR文字列
 * * 626161
 * * 01
 *
 * @example
 * const firstHex = trimFirstHexFromCBOR("626161")
 * // { token: 62, rest: 6161 }
 *
 * const firstHex = trimFirstHexFromCBOR("01")
 * // { token: 01, rest: null }
 */
export const separateTokenFromCBOR = (cbor: string) => {
  const dataHeaderItem = cbor.slice(0, 3);
  // 010というパターンは01で受け取りたいので先頭に0が来ると弾くようにした
  if (parseInt(dataHeaderItem, 16) < 256 && dataHeaderItem[0] !== "0") {
    return {
      token: cbor.slice(0, 3),
      rest: cbor.slice(3) === "" ? cbor.slice(3) : null,
    };
  } else {
    return {
      token: cbor.slice(0, 2),
      rest: cbor.slice(2) === "" ? cbor.slice(2) : null,
    };
  }
};

/**
 * CBOR文字列から最初に現れる16進数を求める関数.
 * CBORに現れる数は16進数であることを利用している
 * @param input CBOR文字列
 * * 6161
 * * 01
 *
 * @example
 * const firstHex = trimFirstHexFromCBOR("6161")
 * // 61
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

type CborIdentiferType = "tiny" | "short" | "long" | undefined;

export type BaseCborType = {
  type: CborIdentiferType;
  // 受け取ったCBORそのもの
  raw: string;
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE;
  // 23以下. TinyCborTypeにとってはこれが実質のvalue
  additionalInformation: number;
  /** typeがlongのときだけ入る。それ以外の時の長さはadditionalInformationでも代用できる(配列・オブジェクト) */
  payloadLength?: number;
};

const ofBaseCbor = (
  cbor: string,
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE,
  additionalInformation: number
): BaseCborType => {
  return {
    type: undefined,
    raw: cbor,
    majorType: majorType,
    additionalInformation,
  };
};

export type TinyCborType = BaseCborType & {
  type: "tiny";
};

const ofTineCbor = (
  cbor: string,
  majorType: MAJOR_TYPE_IDENTIFIER_TYPE,
  additionalInformation: number
): TinyCborType => {
  return {
    type: "tiny",
    raw: cbor,
    majorType: majorType,
    additionalInformation,
  };
};

export type ShortType = BaseCborType & {
  type: "short";
};

/** 与えられた引数からCBORオブジェクトを組み立てる関数 */
const ofShortField = (cbor: string): ShortType => {
  return {
    type: "short",
    raw: cbor,
    majorType: majorType,
    additionalInformation,
    variable,
  };
};

export type LongType = BaseCborType & {
  type: "long";
  /** variableに格納されているデータの長さ. numberがあればlong, なければshort */
  payloadLength: number;
  /** CBOR文字列のうちmajorTypeとadditionalInformationとpayloadLengthを取り除いたもの */
  variable: string;
};

/** 与えられた引数からCBORオブジェクトを組み立てる関数 */
const ofLongField = (cbor: string): LongType => {
  return {
    type: "long",
    raw: cbor,
    majorType: majorType,
    additionalInformation,
    payloadLength,
    variable,
  };
};

/**
 * 未定義のCborTypeを鑑定する
 * @param undefinedTypeCbor
 */
export const detectCborTypeFromBaseCbor = (
  undefinedTypeCbor: BaseCborType
): CborType => {
  switch (undefinedTypeCbor.majorType) {
    case 0:
    case 1:
      return ofTineCbor();
    case 2:
    case 3:
    case 4: // 配列はtinyはありえない(wiki間違ってる)
    case 5:
      // TODO: 適切なCBORを返す
      return ofShortField();
    case 6:
      return ofShortField();
    case 7:
      // TODO: 適切なCBORを返す
      return ofTineCbor();
    default:
      throw new Error("Invalid CBOR Input");
  }
};

export type CborType = TinyCborType | ShortType | LongType;

/**
 * 16進数をdataItemHeaderに分解する。
 * @param input castすると16進数で表現できる文字列
 * @returns DataItemHeader
 */
export const hexToDateitemHeader = (input: number): DataItemHeader => {
  const majorType = (input >> 5) as MAJOR_TYPE_IDENTIFIER_TYPE;
  const additionalInformation = input & 0b00011111;
  if (!majorTypeIdentifiers.includes(majorType)) {
    throw new Error("unexpected major type");
  }
  return { majorType, additionalInformation };
};

/**
 * CBOR文字列からCBORオブジェクトを返す
 * @param cborInput
 */
export const toCBOR = (cborInput: string) => {
  const firstHexAsString = trimFirstHexFromCBOR(cborInput);
  const firstHex = parseInt(firstHexAsString, 2);
  const dataHeaderItem = hexToDateitemHeader(firstHex);
  const { majorType, additionalInformation } = dataHeaderItem;
  return ofBaseCbor();
};
