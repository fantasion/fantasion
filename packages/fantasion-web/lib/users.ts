export type UserLike = {
	firstName?: string | null;
	lastName?: string | null;
};

export const getFullName = (user: UserLike): string => `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
