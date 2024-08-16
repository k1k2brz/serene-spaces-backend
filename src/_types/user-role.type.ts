import { userRole } from '@/_configs';

export type UserRole = (typeof userRole)[keyof typeof userRole];
