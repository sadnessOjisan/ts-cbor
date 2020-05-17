# ts-cbor

a modern TypeScript based cbor decoder and parser.

Just for my training, dont use it in your app.

- https://tools.ietf.org/html/rfc7049
- https://en.wikipedia.org/wiki/CBOR
- https://hogehoge.tk/tool/number.html
- http://cbor.me/?diag=%27g%27
- https://ja.wikipedia.org/wiki/Unicode%E4%B8%80%E8%A6%A7_0000-0FFF
- http://ash.jp/code/unitbl21.htm

## how to use

Setup

```
yarn install
```

Encode

```
$ yarn ts-node src/index.ts encode "[1, 2, 3]"
<Buffer 69 5b 31 2c 20 32 2c 20 33 5d>
```

Decode

```
$ yarn ts-node src/index.ts decode "6161"
a
```

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

### problem

- performance is too bad..., many recursive. should use Stream. (mainly decoder)

### progress

- [ ] encoder
  - [x] number
  - [x] string
  - [x] primitive
  - [x] object
  - [x] array
  - [ ] tag
  - [ ] buffer
- [ ] decoder
  - [x] number
  - [x] string
  - [x] primitive
  - [x] object
  - [x] array
  - [ ] tag
  - [ ] buffer
