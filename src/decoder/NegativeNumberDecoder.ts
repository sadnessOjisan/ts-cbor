import { PositiveNumberDecoder } from "./PositiveNumberDecoder";
import { CborType } from "../helper";

/**
 * 負の数のdecoder
 */
export class NegativeNumberDecoder {
  static decode(cbor: CborType): number {
    return -1 * PositiveNumberDecoder.decode(cbor) - 1;
  }
}
