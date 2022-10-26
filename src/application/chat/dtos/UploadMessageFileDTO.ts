export interface UploadMessageFileInDto {
  fileId: string;
  data: ArrayBuffer;
}

export interface UploadMessageFileOutDto {
  roomId: string;
  messageId: string;
  file: {
    id: string;
    name: string;
    type: string;
    available: boolean;
  };
}
