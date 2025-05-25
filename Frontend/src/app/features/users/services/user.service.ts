import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';
import { environment } from '../../../../environments/environment';
import { RegisterUserDto, LoginUserDto, LoginResponseDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/Users`;
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: string, user: UpdateUserDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  registerUser(user: RegisterUserDto): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, user);
  }

  loginUser(credentials: LoginUserDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.authUrl}/login`, credentials);
  }
}
