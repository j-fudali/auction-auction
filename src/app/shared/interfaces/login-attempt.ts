export interface LoginAttempt {
  is_successful: boolean;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}
