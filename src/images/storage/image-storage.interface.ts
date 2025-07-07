export interface ImageStorage {
  saveImage(file: Express.Multer.File): Promise<string>;
}
