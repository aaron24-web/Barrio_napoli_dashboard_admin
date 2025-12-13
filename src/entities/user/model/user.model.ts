// src/core/models/user.model.ts
export interface User {
  name: string;
  email: string;
}

export interface UpdateProfileParams {
  name: string;
  description: string;
}
