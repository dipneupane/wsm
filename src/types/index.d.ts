import { Icons } from '@/components/icons/icon';

export type ApiResponse<T> = {
  messages: string[];
  Messages?: string[];
  succeeded: boolean;
  Succeeded?: boolean;
  data: T;
};

export type Auth = {
  id: number;
  email: string;
  role: string;
  jwt: string;
};

type UserAuthType = {
  id: number;
  email: string;
  role: string;
  jwt: string;
  refreshToken: string;
};

export enum ApplicationRoleConstant {
  Admin = 'Admin',
  User = 'User',
  Company = 'Company',
}

export interface SiteMap {
  admin: RootPath;
}

export interface RootPath {
  rootUrl: string;
  subPaths: Record<string, SubPath>;
}

export interface SubPath {
  path: string;
  icon?: keyof typeof Icons;
  visible?: boolean;
  children?: Record<string, SubPath>;
}

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
};
