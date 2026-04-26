export interface MessageCreateRequest {
  carId: number;
  senderId: number;
  receiverId: number;
  message: string;
}

export interface MessageResponse {
  id: number;
  carId: number;
  senderId: number;
  receiverId: number;
  message: string;
  sentAt: string;
  isRead?: boolean;
}

export interface MessageThreadResponse {
  carId: number;
  listingTitle?: string;
  messages: MessageResponse[];
}