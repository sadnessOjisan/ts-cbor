// import { Encoder } from "./encoder/Encoder";
import { Decoder } from "./decoder";

// console.log(Encoder.encode(process.argv[2]));

// console.log(
//   Decoder.decode("7818616161616161616161616161616161616161616161616161")
// );

// console.log(Decoder.decode("836161616161")); // [a, a, a]
// console.log(Decoder.takeToken("61")); // error
console.log(Decoder.takeToken("626161")); // 626161
