export interface UserMeResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt?: string;
}

export interface UpdateUserMeRequest {
  name: string;
  phoneNumber?: string;
}