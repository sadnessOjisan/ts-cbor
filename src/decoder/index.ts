import Stream from "stream";

export class Decoder extends Stream.Transform {
  static decode(input: string) {
    const buf = Buffer.from(input);
    console.log(buf);
    const dataItemHeader = buf[0];
    console.log(dataItemHeader);
    const sbinput = dataItemHeader.toString(2);
    const bitLength = sbinput.length;
    const needZero = 8 - (bitLength % 8);
    const paddedBit = "0".repeat(needZero) + sbinput;
    const addedInfo = paddedBit.slice(0, 8);
    const majorTypeString = addedInfo.slice(0, 3);
    const majorType = toNum(toNum(majorTypeString).toString(10));
    console.log(addedInfo);
    if (majorType === 0) {
      console.log(addedInfo);
      if (toNum(toNum(addedInfo).toString(10)) < 24) {
        return addedInfo;
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
