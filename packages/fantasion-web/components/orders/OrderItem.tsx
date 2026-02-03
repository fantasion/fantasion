"use client";

import { IconBubble, SignupIcon } from "../../content/icons";
import { Link } from "../../content/links";
import { DateRange } from "../../datetime/DateRange";
import { useTranslation } from "../../lib/i18n-context";
import { slug } from "../../slugs";
import { getFullName, UserName } from "../users";
import type { OrderItemType, SignupProduct } from "./types";
import { PRODUCT_PROMOTION_CODE, PRODUCT_SIGNUP } from "./types";

export const OrderItemIcon = ({ item }: { item: OrderItemType }) => {
	if (item.productType === PRODUCT_SIGNUP) {
		const signup = item as SignupProduct;
		return (
			<Link route="signupDetail" params={{ signupId: String(signup.id) }}>
				<IconBubble title={getFullName(signup.participant)}>
					<SignupIcon />
				</IconBubble>
			</Link>
		);
	}
	return null;
};

export const OrderItemIcons = ({ items }: { items: OrderItemType[] }) =>
	items.map((item: OrderItemType) => <OrderItemIcon item={item} key={item.id} />);

const OrderItemPromotionCode = () => useTranslation().t("order-promotion-code");

const OrderItemSignup = ({ signup }: { signup: SignupProduct }) => (
	<>
		<Link route="participantDetail" params={{ participantId: String(signup.participant.id) }}>
			<UserName user={signup.participant} />
		</Link>
		<div className="text-muted">
			<Link
				route="expeditionBatchDetail"
				params={{
					expeditionBatchSlug: slug(String(signup.troop.batch.id), signup.troop.batch.expedition.title),
				}}
			>
				{signup.troop.batch.expedition.title} <DateRange start={signup.troop.startsAt} end={signup.troop.endsAt} />
			</Link>
			<span>{` (${signup.troop.ageGroup.title})`}</span>
		</div>
	</>
);

export const OrderItemDescription = ({ item }: { item: OrderItemType }) => {
	if (item.productType === PRODUCT_SIGNUP) {
		return <OrderItemSignup signup={item as SignupProduct} />;
	}
	if (item.productType === PRODUCT_PROMOTION_CODE) {
		return <OrderItemPromotionCode />;
	}
	return item.description ?? null;
};
