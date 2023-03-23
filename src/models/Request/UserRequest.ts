export default interface UserRequest {
  id?: number;
  email: string;
  password?: string;
  displayName?: string;
  role?: string;
  provider?: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
}
