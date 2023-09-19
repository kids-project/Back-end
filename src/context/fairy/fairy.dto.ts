import { Fairy } from '@prisma/client';

export type CreateFairyDto = Pick<Fairy, 'name' | 'type'>;
export type UpdateFairyDto = {
  updateFairyType: 'level' | 'exp';
  expIncrementValue?: number;
};
export type FairyType = 'test1' | 'test2';
