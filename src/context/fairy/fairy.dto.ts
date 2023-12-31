import { AcquireRewardsDto } from '../inventory/inventory.dto';

export type CreateFairyDto = { name: string; type: FairyType };

export type IncreaseFairyExpParams = {
  updateFairyType: 'level' | 'exp';
  expIncrementValue?: number;
};

export type FairyType = 'leafy' | 'flowery';

export type MissionType =
  | 'MON'
  | 'TUE'
  | 'WED'
  | 'THU'
  | 'FRI'
  | 'SAT'
  | 'SUN'
  | 'share'
  | 'attendance'
  | 'purchase'
  | 'trend'
  | 'event'
  | 'new'
  | 'resell';

export type ClearMissionDto = {
  missionType: MissionType;
  acquireRewardsParams: AcquireRewardsDto;
};
