const { SecretKey } = require("../dist/esm/secretkey.js");
const assert = require("assert");

describe("commonjs", () => {
  const key1 = SecretKey.activate();
  const key2 = SecretKey.activate();
  const plain_text = "this is a test text! 1234!#$%&";
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
      console.log(typeof e);
      assert(e instanceof Error);
    }
  });
});