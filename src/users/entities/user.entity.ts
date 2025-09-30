export class UserEntity {
  id: number;
  email: string;
  name?: string | null;
  roles: string;                 // default: "user"
  phone?: string | null;
  address?: string | null;
  refreshToken?: string | null;
  createdAt: Date | null;               // luôn có
  updatedAt: Date | null;               // luôn có
  password?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
    delete this.password; // ẩn password
  }
}