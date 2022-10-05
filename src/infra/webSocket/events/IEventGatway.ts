export interface IEventGatway {
  userConnected(connection: any): Promise<void>;
  userDisconnected(): Promise<void>;
  onMessage(message: any): Promise<void>;
}
