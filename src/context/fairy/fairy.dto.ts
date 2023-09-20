import { Fairy } from '@prisma/client';

export type CreateFairyDto = { name: string; type: FairyType };

export type UpdateFairyDto = {
  updateFairyType: 'level' | 'exp';
  expIncrementValue?: number;
};

export type FairyType = 'leafy' | 'flowery';
