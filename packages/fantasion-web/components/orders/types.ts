import type { OrderStatus } from "./OrderStatus";

export const PRODUCT_SIGNUP = "fantasion_signups.Signup" as const;
export const PRODUCT_PROMOTION_CODE = "fantasion_eshop.OrderPromotionCode" as const;

export type SignupProduct = {
	id: number;
	productType: typeof PRODUCT_SIGNUP;
	description?: string;
	price?: number;
	participant: {
		id: number;
		firstName?: string;
		lastName?: string;
		[key: string]: unknown;
	};
	troop: {
		startsAt: string;
		endsAt: string;
		ageGroup: {
			title: string;
		};
		batch: {
			id: number;
			expedition: {
				title: string;
			};
		};
		[key: string]: unknown;
	};
	[key: string]: unknown;
};

export type PromotionCodeProduct = {
	id: number;
	productType: typeof PRODUCT_PROMOTION_CODE;
	description?: string;
	price?: number;
	[key: string]: unknown;
};

export type OrderItemType =
	| SignupProduct
	| PromotionCodeProduct
	| { id: number; productType?: string; description?: string; price?: number; [key: string]: unknown };

export type Order = {
	id?: number | string;
	variableSymbol?: string;
	isCancellable?: boolean;
	items?: OrderItemType[];
	useDepositPayment?: boolean;
	deposit?: number;
	price?: number;
	status?: OrderStatus;
	submittedAt?: string;
	userInvoiceAddressId?: number | null;
	userInvoiceAddress?: {
		id?: number;
		title?: string;
		street?: string;
		streetNumber?: string;
		city?: string;
		postalCode?: string;
		countryCode?: string;
		[key: string]: unknown;
	};
	[key: string]: unknown;
};

export type OrdersResult = { results: Order[] };
