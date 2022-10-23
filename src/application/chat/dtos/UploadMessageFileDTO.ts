export interface UploadMessageFileInDto {
  fileId: string;
  data: ArrayBuffer;
}

export interface UploadMessageFileOutDto {
  id: string;
  name: string;
  type: string;
  available: boolean;
}
