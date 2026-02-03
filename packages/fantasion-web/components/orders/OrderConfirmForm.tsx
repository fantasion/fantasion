"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "../../content/links";
import { Form } from "../../forms/Form";
import { FormControls } from "../../forms/FormControls";
import { Input } from "../../forms/Input";
import { Trans, useTranslation } from "../../lib/i18n-context";

type OrderConfirmFormValues = {
	requestInsurance?: boolean;
	termsAndConditions: true;
};

type OrderConfirmFormProps = {
	onSubmit: (values: OrderConfirmFormValues) => undefined | Promise<unknown>;
};

export const OrderConfirmForm = ({ onSubmit }: OrderConfirmFormProps) => {
	const { t } = useTranslation();

	const schema = z.object({
		requestInsurance: z.boolean().optional(),
		termsAndConditions: z.literal(true),
	});

	return (
		<Form<OrderConfirmFormValues> onSubmit={onSubmit} resolver={zodResolver(schema)}>
			<Input type="checkbox" name="requestInsurance" label={t("order-request-insurance")} />
			<Input
				type="checkbox"
				name="termsAndConditions"
				label={
					<Trans
						i18nKey="consent-with-plural"
						values={{ subject: t("order-agree-terms-and-conditions") }}
						components={[
							<Link external={true} key="termsAndConditions" route="termsAndConditions">
								{t("order-agree-terms-and-conditions")}
							</Link>,
						]}
					/>
				}
				required={true}
			/>
			<FormControls size="lg" submitLabel={t("order-confirm")} />
		</Form>
	);
};
