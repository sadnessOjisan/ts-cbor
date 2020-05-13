# ts-cbor

a modern typed-cbor.

Just for may RFC Reading training, dont use it in your production.

- https://tools.ietf.org/html/rfc7049
- https://en.wikipedia.org/wiki/CBOR
- https://hogehoge.tk/tool/number.html
- http://cbor.me/?diag=%27g%27

## how to use

Setup

```
yarn install
```

Encode

```
yarn ts-node src/index.ts XXXXX
```

Decode

TBD

## dev

documentaion

```
yarn docgen

open docs/index.html
```

coverage

```
yarn covgen

open coverage/lcov-report/index.html
```

## todo

- [x] encoder
  - [x] number
  - [x] string
  - [x] primitive
  - [x] object
  - [x] array
- [ ] decoder
