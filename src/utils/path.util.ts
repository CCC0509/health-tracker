import { resolve } from 'path';

/**
 * 傳入檔案名稱，取得該檔案在 uploads 資料夾中的絕對路徑。
 * @param filename - 檔案名稱 (包含副檔名)
 * @returns 檔案的絕對路徑
 */
export const getAbsolutePath = (filename: string): string => {
  // process.cwd() 會回傳專案的根目錄
  // 我們假設所有上傳的檔案都儲存在根目錄下的 'uploads' 資料夾中
  return resolve(process.cwd(), 'uploads', filename);
};
