import { Encoder } from "./encoder/Encoder";
import { Decoder } from "./decoder";

type ModeType = "encode" | "decode";

const mode = process.argv[2] as ModeType;
const input = process.argv[3];

switch (mode) {
  case "encode":
    console.log(Encoder.encode(input));
    break;
  case "decode":
    console.log(Decoder.decode(input));
    break;
  default:
    console.error("unexpected mode. prease select encode or decode.");
}
