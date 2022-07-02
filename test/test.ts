import {describe, it } from "mocha";
import { strict as assert } from "assert";

import { SecretKey, encode, decode } from "../src/secretkey";

const key1 = SecretKey.activate();
const key2 = SecretKey.activate();
const plain_text = "this is a test text! 1234!#$%&";

describe("SecretKey", () => {
  it("encode()", () => {
    const encoded1 = key1.encode(plain_text);
    const encoded2 = key2.encode(plain_text);
    assert(encoded1 != encoded2);
  });

  it("decode() - 1", () => {
    const encoded = key1.encode(plain_text);
    assert.equal(plain_text, key1.decode(encoded));
  });

  it("decode() - 2", () => {
    const encoded1 = key1.encode(plain_text);
    try{
      assert(key2.decode(encoded1) != plain_text);
    }catch(e){
      assert(e instanceof Error);
    }
  });

  it("generateKeys()", () => {
    assert.equal(SecretKey.generateKeys().algorithm, "aes-256-cbc");
  });

  it("encode()", () => {
    const result = encode(plain_text);
    assert(
      "data" in result &&
      "options" in result
    );
  });

  it("decode()", () => {
    const result = encode(plain_text);
    assert.equal(
      decode(result.data, result.options),
      plain_text
    );
  });

});
