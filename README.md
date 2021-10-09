# endecoder

A module can encode/decode strings with the keys.

## Installation

``` shell
npm install endecoder
```

## Usage

### encode / decode easily

``` typescript
import { encode, decode } from "endecoder";

const PLAIN_TEXT = "this is a test string !#$%&'()";

const { data: encoded, options } = encode(PLAIN_TEXT);
// save options for decoding

const decoded = decode(encoded, options);

console.log(PLAIN_TEXT == decoded);
// true

```

### more detailed

``` typescript
import { SecretKey } from "endecoder";

const PLAIN_TEXT = "this is a test string !#$%&'()";

const password = "testpassword!!#$%";
const salt = "salt///:*";

const key = SecretKey.activate({
  password,
  salt
});

const encoded = key.encode(PLAIN_TEXT);
console.log(encoded);

console.log(key.decode(encoded) == PLAIN_TEXT);
// true

// wrong password and salt combination
const alt_key = SecretKey.activate({
  password,
  salt: "salt///;*"
});

try{
  const decoded = alt_key.decode(encoded);
  console.log(decoded == PLAIN_TEXT);
  // will be false
}catch(error){
  // or an error may occur
}

```
