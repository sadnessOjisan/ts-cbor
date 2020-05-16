import {
  DataItemHeader,
  MAJOR_TYPE_IDENTIFIER_TYPE,
  majorTypeIdentifiers,
} from "./const";

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

/**
 * 16進数をdataItemHeaderに分解する。
 * @param input castすると16進数で表現できる文字列
 * @returns DataItemHeader
 */
export const hexToDateitemHeader = (input: number): DataItemHeader => {
  const majorType = (input >> 5) as MAJOR_TYPE_IDENTIFIER_TYPE;
  const addedInfo = input & 0b00011111;
  if (!majorTypeIdentifiers.includes(majorType)) {
    throw new Error("unexpected major type");
  }
  return { majorType, addedInfo };
};
