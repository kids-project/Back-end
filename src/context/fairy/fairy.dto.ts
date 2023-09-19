import { Fairy } from '@prisma/client';

export type CreateFairyDto = Pick<Fairy, 'name' | 'type'>;
export type UpdateFairyDto = Pick<Fairy, 'level' | 'exp'>;
export type FairyType = 'test1' | 'test2';
