import type { HTMLAttributes } from "react";

export type UserLike = {
	firstName?: string | null;
	lastName?: string | null;
	[key: string]: unknown;
};

export type UserNameProps = HTMLAttributes<HTMLSpanElement> & {
	user?: UserLike | null;
	getFullName: (user: UserLike) => string;
};

export const UserName = ({ user, getFullName, ...props }: UserNameProps) =>
	user ? <span {...props}>{getFullName(user)}</span> : null;
