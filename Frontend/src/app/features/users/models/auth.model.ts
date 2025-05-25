export interface RegisterUserDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  vehicleDetails?: string | null;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  expiration: string;
  userId: string;
  email: string;
  name: string;
  role: string;
}