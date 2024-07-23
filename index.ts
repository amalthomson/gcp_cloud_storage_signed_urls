import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import path from 'path';

const serviceAccountPath = '/Users/office-ayatacommerce/Desktop/Keys/static-website-hosting-429208-bfd6442492b3.json';

const storage = new Storage({
    keyFilename: serviceAccountPath,
    projectId: 'static-website-hosting-429208',
});

const bucketName = 'bucket-demo-signed-urls';

async function createBucket() {
    await storage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} created.\n`);
}

async function generateV4UploadSignedUrl(filename: string): Promise<string> {
    const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl(options);
    return url;
}

async function generateV4DownloadSignedUrl(filename: string): Promise<string> {
    const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [url] = await storage.bucket(bucketName).file(filename).getSignedUrl(options);
    return url;
}

async function main() {
    await createBucket();

    const uploadUrl = await generateV4UploadSignedUrl('test-upload-file.txt');
    console.log(`Upload URL: ${uploadUrl}\n`);

    const downloadUrl = await generateV4DownloadSignedUrl('test-upload-file.txt');
    console.log(`Download URL: ${downloadUrl}\n`);
}

main().catch(console.error);
