import { UserName as UiUserName } from "@fantasion/ui";
import type { HTMLAttributes } from "react";
import { getFullName, type UserLike } from "../lib/users";

export const UserName = ({ user, ...props }: { user?: UserLike | null } & HTMLAttributes<HTMLSpanElement>) => (
	<UiUserName user={user} getFullName={getFullName} {...props} />
);
