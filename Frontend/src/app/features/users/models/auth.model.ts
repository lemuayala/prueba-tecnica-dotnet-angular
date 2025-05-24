export interface RegisterUserDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  vehicleDetails?: string | null;
}