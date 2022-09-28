# getting started

1. installation
1. ad hoc encode/decode
1. with prepared password and salt

***

## installation

``` shell
npm install endecoder
```

## ad hoc encode/decode
``` typescript
import { encode, decode } from "endecoder";

const plainText = "this is a test string !!#$%";

const { data: encoded, options } = encode(plainText);
// save options for decoding

const decoded = decode(encoded, options);

assert.equal(decoded, plainText);
```

### with prepared password and salt
``` typescript
import { encode, decode } from "endecoder";

const plainText = "this is a test string !!#$%";
const options = {
  password: "my password",
  salt: "salt!"
};

const { data: encoded } = encode(plainText, options);

const decoded = decode(encoded, options);

assert.equal(decoded, plainText);
```
