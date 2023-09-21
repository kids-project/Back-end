import { Fairy } from '@prisma/client';

export type CreateFairyDto = { name: string; type: FairyType };

export type IncreaseFairyExpParams = {
  updateFairyType: 'level' | 'exp';
  expIncrementValue?: number;
};

export type FairyType = 'leafy' | 'flowery';
