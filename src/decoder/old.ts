export class Decoder {
  static decode(input: string): any {
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
        let cnt = addedInfo;
        if (cnt === 0) {
          return res;
        }
        while (cnt !== 0) {
          console.log("[Decoder] <decode> eated", eated);
          if (eated.eated === "") {
            console.log("[Decoder] <decode> cnt", cnt);
            throw new Error("token足りない");
          }
          eated = this.eatString(eated.eated);
          res += String.fromCharCode(eated.target);
          cnt -= 1;
        }
        return res;
      } else {
        const needEat = addedInfo - 23;
        let eated = firstEated;
        for (let i = 0; i < needEat; i++) {
          eated = this.eatString(eated.eated);
        }

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
    } else if (majorType === 4) {
      console.log("[Decoder] <decode> firstEated", firstEated);
      console.log("[Decoder] <decode> addedInfo", addedInfo);
      if (addedInfo < 24) {
        return this.decodeArray(firstEated);
      } else {
      }
    } else if (majorType === 5) {
      console.log("[Decoder] <decode> addedInfo", addedInfo);
    }
  }

  static decodeArray(firstEated: { target: number; eated: string }) {
    const res = [];
    let eated;
    while (true) {
      const token = this.takeToken(eated ? eated.eated : firstEated.eated);
      console.log("[Decoder] <decodeArray> token", token);
      eated = this.eatStringRaw(eated ? eated.eated : firstEated.eated);
      res.push(this.decode(token));
      if (eated.eated === "") {
        break;
      }
    }
    return res;
  }

  /**
   * 文字列から一文字に値するものを切り出す
   * @param input @example '6161'
   * @return @example 6161
   */
  static takeToken(input: string) {
    console.log("[Decoder] <takeToken> input", input);
    const fistEated = this.eatStringRaw(input);
    console.log("[Decoder] <takeToken> fistEated", fistEated);
    let targetToken = fistEated.target;
    while (true) {
      try {
        this.decode(targetToken);
        return targetToken;
      } catch {
        const eated = this.eatStringRaw(input);
        targetToken += eated.target;
        if (eated.eated === "") {
          break;
        }
        this.takeToken(fistEated.eated);
      }
      // TODO: 終了条件
    }
    return targetToken;
  }

  static eatString(input: string) {
    const dataHeaderItem = input.slice(0, 3);
    if (parseInt(dataHeaderItem, 16) < 256 && dataHeaderItem[0] !== "0") {
      return { target: parseInt(input.slice(0, 3), 16), eated: input.slice(3) };
    } else {
      return { target: parseInt(input.slice(0, 2), 16), eated: input.slice(2) };
    }
  }

  static eatStringRaw(input: string) {
    const dataHeaderItem = input.slice(0, 3);
    if (parseInt(dataHeaderItem, 16) < 256 && dataHeaderItem[0] !== "0") {
      return { target: input.slice(0, 3), eated: input.slice(3) };
    } else {
      return { target: input.slice(0, 2), eated: input.slice(2) };
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
