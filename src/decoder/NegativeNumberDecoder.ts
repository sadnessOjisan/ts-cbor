import { PositiveNumberDecoder } from "./PositiveNumberDecoder";
import { DataItemHeader } from "../const";

/**
 * 負の数のdecoder
 */
export class NegativeNumberDecoder {
  static decode(cbor: string, dataItemHeader: DataItemHeader): number {
    return -1 * PositiveNumberDecoder.decode(cbor, dataItemHeader) - 1;
  }
}
