export interface UserInfo {
  id: string;
  name: string;
  avatarUrl: string;
}

export class RoomUser {
  isOwner: boolean;
  available: boolean;
  userInfo: UserInfo;

  constructor(available: boolean, user: UserInfo) {
    this.available = available;
    this.userInfo = user;
  }

  setOwner(): void {
    this.isOwner = true;
  }
}
