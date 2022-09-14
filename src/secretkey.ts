import * as crypto from "crypto";
import { deflate, inflate } from "zlib";

export interface SecretKeyOptions {
  algorithm?: string;
  password?: string;
  salt?: string;
}

class SecretKeyBase {
  protected algorithm: string;
  protected password: string;
  protected salt: string;
  constructor(algorithm: string, password: string, salt: string) {
    this.algorithm = algorithm;
    this.password = password;
    this.salt = salt;
  }

  protected getKey(): Buffer {
    return crypto.scryptSync(this.password, this.salt, 32);
  }

  public encode(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.getKey(), iv);
    let encryptedData = cipher.update(data);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    return [iv.toString("base64"), encryptedData.toString("base64")].join(":");
  }

  public decode(data: string): string {
    const [iv, encryptedData] = data
      .split(":")
      .map((v) => Buffer.from(v, "base64"));
    const decipher = crypto.createDecipheriv(this.algorithm, this.getKey(), iv);
    let decryptedData = decipher.update(encryptedData);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
    return decryptedData.toString();
  }

  public async encrypt(data: Buffer): Promise<string> {
    const deflatedData = await new Promise((resolve, reject) =>
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      deflate(data, (err, rdata) => (err ? reject : resolve)(err ?? rdata))
    );
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.getKey(), iv);
    return [
      iv.toString("base64"),
      Buffer.concat([
        cipher.update(deflatedData as Buffer),
        cipher.final(),
      ]).toString("base64"),
    ].join(":");
  }

  public async decrypt(data: string): Promise<Buffer> {
    const [iv, encryptedData] = data
      .split(":")
      .map((v) => Buffer.from(v, "base64"));
    const decipher = crypto.createDecipheriv(this.algorithm, this.getKey(), iv);
    return await new Promise((resolve, reject) =>
      inflate(
        Buffer.concat([decipher.update(encryptedData), decipher.final()]),
        (err, rdata) => {
          if (err != null) {
            reject(err);
          } else {
            resolve(rdata);
          }
        }
      )
    );
  }

  public static activate({
    algorithm,
    password,
    salt,
  }: SecretKeyOptions): SecretKeyBase {
    return new this(algorithm as string, password as string, salt as string);
  }
}

export class SecretKey extends SecretKeyBase {
  constructor(options?: SecretKeyOptions) {
    const defaultKeys = SecretKey.generateKeys();
    super(
      options?.algorithm ?? defaultKeys.algorithm,
      options?.password ?? defaultKeys.password,
      options?.salt ?? defaultKeys.salt
    );
  }

  public static activate(options?: SecretKeyOptions): SecretKey {
    return new this(options);
  }

  public static generateKeys(): {
    algorithm: string;
    password: string;
    salt: string;
  } {
    return {
      algorithm: "aes-256-cbc",
      password: crypto.randomBytes(48).toString("base64"),
      salt: crypto.randomBytes(12).toString("base64"),
    };
  }
}

export function encode(
  data: string,
  options?: SecretKeyOptions
): { data: string; options: SecretKeyOptions } {
  const lopt = {
    ...SecretKey.generateKeys(),
    ...(options ?? {}),
  };
  return {
    data: SecretKey.activate(lopt).encode(data),
    options: lopt,
  };
}

export function decode(data: string, options?: SecretKeyOptions): string {
  return SecretKey.activate(options).decode(data);
}
