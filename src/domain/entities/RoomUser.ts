import { User } from "./User";

export interface UserInfo {
  id: string;
  name: string;
  avatarUrl: string;
}

export class RoomUser {
  available: boolean;
  userInfo: UserInfo;

  constructor(available: boolean, user: UserInfo) {
    this.available = available;
    this.userInfo = user;
  }
}