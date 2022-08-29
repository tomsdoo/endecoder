# endecoder

A module can encode/decode strings with the keys.

![npm](https://img.shields.io/npm/v/endecoder)
![NPM](https://img.shields.io/npm/l/endecoder)
![npms.io (quality)](https://img.shields.io/npms-io/quality-score/endecoder)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/endecoder)
![Maintenance](https://img.shields.io/maintenance/yes/2022)

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

### SecretKey class
``` typescript
type SecretKeyOptions = {
    algorithm?: string;
    password?: string;
    salt?: string;
};

class SecretKey {
  constructor(options?: SecretKeyOptions);
  public encode(data: string): string;
  public decode(data: string): string;
  public encrypt(data: Buffer): Promise<string>;
  public decrypt(data: string): Promise<Buffer>;
  public static activate(options?: SecretKeyOptions): SecretKey;
  public static generateKeys(): {
    algorithm: string;
    password: string;
    salt: string;
  };
}

```
