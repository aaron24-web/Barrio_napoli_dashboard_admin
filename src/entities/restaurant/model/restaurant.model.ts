// src/core/models/restaurant.model.ts
export interface Restaurant {
  name: string;
  description: string | null;
}

export interface UpdateRestaurantProfileParams {
  name: string;
  description: string | null;
}

export interface RegisterRestaurantParams {
  restaurantName: string;
  managerName: string;
  email: string;
  phone: string;
  password?: string;
}
