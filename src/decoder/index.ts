import Stream from "stream";

export class Decoder extends Stream.Transform {
  static decode(input: string) {
    const sbinput = parseInt(input, 16).toString(2);
    const bitLength = sbinput.length;
    const needZero = 8 - (bitLength % 8);
    const paddedBit = "0".repeat(needZero) + sbinput;
    console.log("[Decoder]<decode> paddedBit ", paddedBit);
    const addedInfo = paddedBit.slice(0, 8);
    const majorTypeString = addedInfo.slice(0, 3);
    const majorType = toNum(toNum(majorTypeString).toString(10));
    console.log("[Decoder]<decode> addedInfo ", addedInfo);
    console.log("[Decoder]<decode> majorType ", majorType);
    if (majorType === 0) {
      // 整数ケース
      const infoNum = toNum(parseInt(addedInfo, 2).toString(10));
      console.log("[Decoder]<decode> infoNum ", infoNum);
      if (infoNum < 24) {
        // addedInfoがそのまま数字になる
        return infoNum;
      } else if (infoNum < 256) {
        // addedInfoの次8bitが数値
        const res = paddedBit.slice(8, 16);
        const ret = toNum(parseInt(res, 2).toString(10));
        return ret;
      }
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
