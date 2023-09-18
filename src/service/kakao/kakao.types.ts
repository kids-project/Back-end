import { SignInWithKakaoRequestDto } from 'src/context/users/users.dto';

export type SignInArgs = SignInWithKakaoRequestDto;

export type OAuthToken = {
  token_type: 'bearer';
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
};

export type KakaoMe = {
  id: number;
  connected_at: string;
  kakao_account: {
    name_needs_agreement: boolean;
    name?: string;
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
    has_phone_number: boolean;
    phone_number_needs_agreement: boolean;
    phone_number: string;
    has_age_range: boolean;
    age_range_needs_agreement: boolean;
    age_range?: string;
    has_birthyear: boolean;
    birthyear_needs_agreement: boolean;
    birthyear?: string;
    has_birthday: boolean;
    birthday_needs_agreement: boolean;
    birthday?: string;
    birthday_type?: string;
    has_gender: boolean;
    gender_needs_agreement: boolean;
    gender?: 'male' | 'female';
  };
};
