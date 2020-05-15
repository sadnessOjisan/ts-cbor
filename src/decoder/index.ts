/**
 * TODO: file分けたい
 */

import Stream from "stream";

export class Decoder extends Stream.Transform {
  static decode(input: string) {
    const sb0xinput = parseInt(input, 16);
    const sbinput = sb0xinput.toString(2);
    const bitLength = sbinput.length;
    const needZero = 8 - (bitLength % 8);
    const paddedBit = "0".repeat(needZero) + sbinput;
    const firstEated = this.eatString(input);
    const majorType = firstEated.target >> 5;
    const addedInfo = firstEated.target & 0b00011111;
    if (majorType === 0) {
      // 整数ケース
      return this.decodeNum(paddedBit);
    } else if (majorType === 1) {
      return -1 * this.decodeNum(paddedBit) - 1;
    } else if (majorType === 2) {
      // buffer
    } else if (majorType === 3) {
      // string
      if (addedInfo < 24) {
        let res = "";
        let eated = firstEated;
        while (true) {
          if (eated.eated === "") {
            break;
          }
          eated = this.eatString(eated.eated);
          res += String.fromCharCode(eated.target);
        }
        return res;
      } else {
        const needEat = addedInfo - 23;
        console.log("[Decoder] <decode> needEat", needEat);
        let eated = firstEated;
        console.log("[Decoder] <decode>A eated.eated", eated.eated);
        for (let i = 0; i < needEat; i++) {
          console.log("[Decoder] <decode> i", i);
          eated = this.eatString(eated.eated);
          console.log("[Decoder] <decode> eated.eated", eated.eated);
        }
        console.log(
          "[Decoder] <decode> eated.eated.length",
          eated.eated.length
        );
        // 1回eatしたら長さが手に入る
        let res = "";
        while (true) {
          if (eated.eated === "") {
            break;
          }
          eated = this.eatString(eated.eated);
          res += String.fromCharCode(eated.target);
        }
        return res;
      }
    }
  }

  static eatString(input: string) {
    const dataHeaderItem = input.slice(0, 3);
    if (parseInt(dataHeaderItem, 16) < 256 && dataHeaderItem[0] !== "0") {
      return { target: parseInt(input.slice(0, 3), 16), eated: input.slice(3) };
    } else {
      return { target: parseInt(input.slice(0, 2), 16), eated: input.slice(2) };
    }
  }

  static isIncludeDoubleZero(input: string) {
    return input.includes("00") || input.includes("010");
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

  static detectMajorType(input: string) {
    const dataHeaderItem = input.slice(0, 3);
    if (parseInt(dataHeaderItem, 16) < 256) {
      return parseInt(dataHeaderItem, 16) >> 5;
    } else {
      return parseInt(input.slice(0, 2), 16) >> 5;
    }
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
