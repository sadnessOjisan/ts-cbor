/**
 * TODO: file分けたい
 */

import Stream from "stream";

export class Decoder extends Stream.Transform {
  static decode(input: string) {
    const sbinput = parseInt(input, 16).toString(2);
    const bitLength = sbinput.length;
    const needZero = 8 - (bitLength % 8);
    const paddedBit = "0".repeat(needZero) + sbinput;
    const addedInfo = paddedBit.slice(0, 8);
    const majorTypeString = addedInfo.slice(0, 3);
    const majorType = toNum(toNum(majorTypeString).toString(10));
    console.log("majorType", majorType);
    if (majorType === 0) {
      // 整数ケース
      return this.decodeNum(paddedBit);
    } else if (majorType === 1) {
      return -1 * this.decodeNum(paddedBit) - 1;
    }
  }

  static decodeNum(paddedBit: string) {
    const infoNum = parseInt(paddedBit.slice(0, 8), 2) & 0b00011111;
    if (infoNum < 24) {
      // addedInfoがそのまま数字になる
      return infoNum;
    } else if (infoNum === 24) {
      // addedInfoの次8bitが数値
      const res = paddedBit.slice(8, 16);
      const ret = toNum(parseInt(res, 2).toString(10));
      return ret;
    } else if (infoNum === 25) {
      // addedInfoの次18bitが数値
      const res = paddedBit.slice(8, 24);
      const ret = toNum(parseInt(res, 2).toString(10));
      return ret;
    } else if (infoNum === 26) {
      // addedInfoの次32bitが数値
      const res = paddedBit.slice(8, 40);
      const ret = toNum(parseInt(res, 2).toString(10));
      return ret;
    } else if (infoNum === 27) {
      // addedInfoの次64bitが数値
      const res = paddedBit.slice(8, 72);
      const ret = toNum(parseInt(res, 2).toString(10));
      return ret;
    }
    throw new Error("un reach");
  }
}

/**
 * 文字列を数字に変換。（切り出してもいいかも）
 * @param input
 */
const toNum = (input: string) => {
  try {
    return Number(input);
  } catch {
    throw new Error("parse error");
  }
};
