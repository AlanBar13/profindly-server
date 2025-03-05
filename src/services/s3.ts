import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class S3Service {
  private bucketName = Bun.env.AWS_S3_BUCKET_NAME;
  private region: string;
  private client: S3Client;

  constructor() {
    const region = Bun.env.AWS_S3_REGION ?? "";
    const accessKey = Bun.env.AWS_ACCESS_KEY_ID ?? "";
    const secretAccessKey = Bun.env.AWS_SECRET_ACCESS_KEY ?? "";

    const client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    });
    this.client = client;
    this.region = region;
  }

  async uploadFile(file: Express.Multer.File, isPublic: boolean) {
    try {
      const key = `${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? "public-read" : "private",
        Metadata: {
          originalName: file.originalname,
        },
      });

      await this.client.send(command);

      return {
        url: isPublic ? this.getFileUrl(key) : await this.getPreSignedUrl(key),
        key,
        isPublic,
      };
    } catch (error) {
      console.log(error)
      throw new Error(`File Uploading failed`);
    }
  }

  getFileUrl(key: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async getPreSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 3, //3 hrs
      });

      return url;
    } catch (error) {
      throw new Error(`Error getting preSigned Url`);
    }
  }
}

export const s3Service = new S3Service();
