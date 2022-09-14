import { describe, it } from "mocha";
import { strict as assert } from "assert";
import { randomBytes } from "crypto";

import { SecretKey, encode, decode } from "../src/secretkey";

const key1 = SecretKey.activate();
const key2 = SecretKey.activate();
const plainText = "this is a test text! 1234!#$%&";

describe("SecretKey", () => {
  it("encode()", () => {
    const encoded1 = key1.encode(plainText);
    const encoded2 = key2.encode(plainText);
    assert(encoded1 !== encoded2);
  });

  it("decode() - 1", () => {
    const encoded = key1.encode(plainText);
    assert.equal(plainText, key1.decode(encoded));
  });

  it("decode() - 2", () => {
    const encoded1 = key1.encode(plainText);
    try {
      assert(key2.decode(encoded1) !== plainText);
    } catch (e) {
      assert(e instanceof Error);
    }
  });

  it("generateKeys()", () => {
    assert.equal(SecretKey.generateKeys().algorithm, "aes-256-cbc");
  });

  it("encode()", () => {
    const result = encode(plainText);
    assert("data" in result && "options" in result);
  });

  it("decode()", () => {
    const result = encode(plainText);
    assert.equal(decode(result.data, result.options), plainText);
  });

  it("encrypt() & decrypt()", async () => {
    const plainBuffer = randomBytes(1024 * 1024);
    const encryptedData = await key1.encrypt(plainBuffer);
    const decryptedData = await key1.decrypt(encryptedData);
    assert.equal(
      plainBuffer.toString("base64"),
      decryptedData.toString("base64")
    );
    await assert.rejects(async () => await key2.decrypt(encryptedData));
  });
});
