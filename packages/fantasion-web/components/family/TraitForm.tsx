"use client";

import { useState } from "react";
import { capitalize } from "../../api";
import { Form } from "../../forms/Form";
import { FormControls } from "../../forms/FormControls";
import { useTranslation } from "../../lib/i18n-context";
import { InteractiveButton } from "../buttons";
import { SearchInput } from "../search";

type TraitOption = {
	id?: string | number;
	title: string;
	[key: string]: unknown;
};

type TraitItem = Record<string, { title?: string; [key: string]: unknown } | unknown>;

type TraitFormProps = {
	collection: string;
	items: TraitItem[];
	onCancel: () => void;
	onSetNone: () => Promise<void> | void;
	onSubmit: (payload: Record<string, unknown>) => undefined | Promise<unknown>;
	trait: string;
};

export const TraitForm = ({ collection, items, onCancel, onSetNone, onSubmit, trait }: TraitFormProps) => {
	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(false);

	const defaultValues: Record<string, unknown> = {
		[collection]: items.map((item: TraitItem) => item[trait]),
	};

	const handleSetNone = async () => {
		setDisabled(true);
		try {
			await onSetNone();
			onCancel();
		} finally {
			setDisabled(false);
		}
	};

	const handleSubmit = (values: Record<string, unknown>): undefined => {
		const incoming = (values[collection] || []) as TraitOption[];
		const translated = incoming.map(
			(v: TraitOption) =>
				items.find((i: TraitItem) => {
					const traitValue = i?.[trait] as { title?: string } | undefined;
					return traitValue?.title === v.title;
				}) || {
					[trait]: v,
				},
		);
		onSubmit({
			[collection]: translated,
		});
	};

	return (
		<Form defaultValues={defaultValues} id={`form-${trait}`} onSubmit={handleSubmit}>
			<SearchInput
				allowNew={true}
				autoFocus={true}
				collection={collection}
				disabled={disabled}
				label={t(`participant-${collection}`)}
				itemToString={(item: TraitOption | null) => item?.title ?? ""}
				stringToOption={(title: string) => ({
					id: title,
					title: capitalize(title),
				})}
				multiple={true}
				name={collection}
				required={true}
			/>
			<FormControls cancelLabel={t("cancel")} disabled={disabled} onCancel={onCancel} submitLabel={t("form-save")}>
				<InteractiveButton className="ms-2" variant="secondary" onClick={handleSetNone}>
					{t(`participant-trait-has-no-${trait}`)}
				</InteractiveButton>
			</FormControls>
		</Form>
	);
};
