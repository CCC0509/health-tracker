export interface ImageStorage {
  saveImage(file: Express.Multer.File): Promise<string>;
  removeImage(filename: string): Promise<void>;
}
