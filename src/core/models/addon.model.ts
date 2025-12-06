// src/core/models/addon.model.ts
export interface Addon {
  id: string;
  name: string;
  priceInCents: number;
  isAvailable: boolean;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddonPayload {
  name: string;
  priceInCents: number;
  categoryIds: string[];
  image?: File;
}

export interface UpdateAddonPayload extends Partial<CreateAddonPayload> {
  id: string;
}
