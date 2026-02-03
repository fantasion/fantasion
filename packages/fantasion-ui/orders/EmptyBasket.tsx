import { Alert } from "../Alert";

export type EmptyBasketProps = {
	message: string;
	[key: string]: unknown;
};

export const EmptyBasket = ({ message, ...props }: EmptyBasketProps) => <Alert {...props}>{message}</Alert>;
