export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  reputation: number;
  vehicleDetails: string | null;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phoneNumber: string;
  vehicleDetails: string | null;
}

export interface UpdateUserDto extends CreateUserDto {
  id: string;
  reputation?: number;
}
