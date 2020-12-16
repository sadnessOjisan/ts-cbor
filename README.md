# ts-cbor

this is a just toy.

## how to use

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
