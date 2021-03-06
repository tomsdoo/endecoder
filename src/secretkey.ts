import * as crypto from "crypto";

export type SecretKeyOptions = {
  algorithm?: string;
  password?: string;
  salt?: string;
};

class SecretKeyBase {
  protected algorithm: string;
  protected password: string;
  protected salt: string;
  constructor(
    algorithm: string,
    password: string,
    salt: string
  ){
    this.algorithm = algorithm;
    this.password = password;
    this.salt = salt;
  }
  protected getKey(){
    return crypto.scryptSync(this.password, this.salt, 32);
  }
  public encode(data: string){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.getKey(),
      iv
    );
    let encryptedData = cipher.update(data);
    encryptedData = Buffer.concat([
      encryptedData,
      cipher.final()
    ]);
    return [
      iv.toString("base64"),
      encryptedData.toString("base64")
    ].join(":");
  }
  public decode(data: string){
    const [
      iv,
      encryptedData
    ] = data.split(":").map(
      v => Buffer.from(v, "base64")
    );
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.getKey(),
      iv
    );
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([
      decryptedData,
      decipher.final()
    ]);
    return decryptedData.toString();
  }
  public static activate({
    algorithm,
    password,
    salt
  }: SecretKeyOptions){
    return new this(
      algorithm as string,
      password as string,
      salt as string
    );
  }
}

export class SecretKey extends SecretKeyBase {
  constructor(options?: SecretKeyOptions){
    const defaultKeys = SecretKey.generateKeys();
    super(
      options && options.algorithm || defaultKeys.algorithm,
      options &&options.password || defaultKeys.password,
      options && options.salt || defaultKeys.salt
    );
  }
  public static activate(options?: SecretKeyOptions){
    return new this(options);
  }
  public static generateKeys(){
    return {
      algorithm: "aes-256-cbc",
      password: crypto.randomBytes(48).toString("base64"),
      salt: crypto.randomBytes(12).toString("base64")
    };
  }
}

export function encode(
  data: string,
  options?: SecretKeyOptions
){
  const lopt = {
    ...SecretKey.generateKeys(),
    ...(options ? options : {})
  };
  return {
    data: SecretKey
      .activate(lopt)
      .encode(data),
    options: lopt
  };
}

export function decode(
  data: string,
  options?: SecretKeyOptions
){
  return SecretKey
    .activate(options)
    .decode(data);
}
