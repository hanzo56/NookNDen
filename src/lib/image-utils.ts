const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.75;
const MAX_FILE_SIZE = 500 * 1024; // 500 KB target

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = JPEG_QUALITY;
  let blob = await canvas.convertToBlob({ type: "image/jpeg", quality });

  // If still too large, reduce quality iteratively
  while (blob.size > MAX_FILE_SIZE && quality > 0.3) {
    quality -= 0.1;
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  }

  const name = file.name.replace(/\.[^.]+$/, ".jpg");
  return new File([blob], name, { type: "image/jpeg" });
}
