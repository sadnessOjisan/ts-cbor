import { PositiveNumberDecoder } from "./PositiveNumberDecoder";
import { CborType, BaseCborType } from "../helper";

/**
 * 負の数のdecoder
 */
export class NegativeNumberDecoder {
  static decode(cbor: BaseCborType): number {
    return -1 * PositiveNumberDecoder.decode(cbor) - 1;
  }
}
