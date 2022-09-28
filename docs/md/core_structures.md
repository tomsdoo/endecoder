# core structures

The core structures are below.

``` mermaid
classDiagram

class SecretKeyBase {
  #string algorithm
  #string password
  #string salt
  +constructor(algorithm: string, password: string, salt: string)
  +encode(data: string) string
  +decode(data: string) string
  +encrypt(data: Buffer) Promise~string~
  +decrypt(data: string) Promise~Buffer~
  +activate(options: SecretKeyOptions)$ SecretKeyBase
}

class SecretKeyOptions {
  <<interface>>
  +string? algorithm
  +string? password
  +string? salt
}

class SecretKey {
  +constructor(options: SecretKeyOptions)
  +activate(options: SecretKeyOptions)$ SecretYey
  +generateKeys()$ SecretKeyOptions
}


SecretKeyBase <|-- SecretKey
```

## usage

``` typescript
import { SecretKey } from "endeccoder";

const [ plainText, password, salt ] = [
  "this is a test string !!",
  "password!!",
  "salt#"
];

const key = SecretKey.activate({
  password,
  salt
});

const encoded = key.encode(plainText);

assert.equal(
  key.decode(encoded),
  plainText
);

```
