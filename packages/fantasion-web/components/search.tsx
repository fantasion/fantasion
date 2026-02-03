"use client";

import { Badge, Button, DropdownItem, DropdownMenu, FormGroup, Spinner } from "@fantasion/ui";
import classnames from "classnames";
import { useCombobox } from "downshift";
import type React from "react";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CancelIcon } from "../content/icons";
import { TextTooltip } from "../content/tooltips";
import { FormLabel } from "../forms/FormLabel";
import { useTranslation } from "../lib/i18n-context";
import { useFetch } from "./context";
import { useMounted } from "./hooks";
import styles from "./search.module.scss";

type SearchOption = {
	id: string | number;
	title: string;
	description?: string;
	[key: string]: unknown;
};

type OptionsResponse<T> = {
	results: T[];
};

const TYPING_THROTTLE = 125;
const DEFAULT_INPUT_SIZE = 3;

type SearchElementProps = {
	children: ReactNode;
	show: boolean;
	[key: string]: unknown;
};

const SearchElement = ({ children, show, ...props }: SearchElementProps) => (
	<DropdownItem className={classnames(styles.menuElement, { [styles.show]: show })} {...props}>
		{children}
	</DropdownItem>
);

const SearchEmpty = ({ query, show }: { query: string; show: boolean }) => (
	<SearchElement show={show}>{useTranslation().t("search-no-results-found", { query: query })}</SearchElement>
);

const SearchLoader = ({ show }: { show: boolean }) => (
	<SearchElement show={show}>
		<span className="text-muted">
			<Spinner animation="border" role="status" size="sm" /> {useTranslation().t("search-loading")}
		</span>
	</SearchElement>
);

type SelectBubbleProps<T> = {
	item: T;
	itemToString: (item: T) => string;
	onRemove: (item: T) => void;
};

const SelectBubble = <T extends { description?: unknown }>({ item, itemToString, onRemove }: SelectBubbleProps<T>) => (
	<Badge className={styles.bubble}>
		<span className={styles.bubbleLabel}>
			<TextTooltip tip={item.description as React.ReactNode}>{itemToString(item)}</TextTooltip>
		</span>
		<Button onClick={() => onRemove(item)}>
			<CancelIcon />
		</Button>
	</Badge>
);

type WritableSelectProps<T> = {
	disabled?: boolean;
	itemToString: (item: T) => string;
	label: string;
	onRemove: (item: T) => void;
	parentName: string;
	required?: boolean;
	/**
	 * Props forwarded to the underlying `<input />` (e.g. from downshift `getInputProps()`).
	 */
	inputProps: React.InputHTMLAttributes<HTMLInputElement>;
};

const ReflessWritableSelect = <T,>(
	{ disabled, itemToString, label, onRemove, parentName, required, inputProps }: WritableSelectProps<T>,
	ref: ForwardedRef<HTMLInputElement>,
) => {
	const { watch } = useFormContext();
	const raw = watch(parentName) as unknown;
	const values: T[] = toValueArray<T>(raw);

	const searchRef = useRef<HTMLInputElement | null>(null);
	useImperativeHandle(ref, () => searchRef.current as HTMLInputElement);

	const focusInput = useCallback(() => searchRef.current?.focus(), []);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				focusInput();
			}
		},
		[focusInput],
	);

	const inputSize =
		String(inputProps.value ?? "").length > 0 ? String(inputProps.value ?? "").length : DEFAULT_INPUT_SIZE;

	return (
		<FormGroup>
			<FormLabel text={label} required={required} />
			{/* biome-ignore lint/a11y/useSemanticElements: Custom input component uses role="button" for styling while containing a real input element */}
			<div
				className={classnames("d-flex", "form-control", styles.writable, {
					[styles.disabled]: disabled,
				})}
				role="button"
				tabIndex={0}
				onClick={focusInput}
				onKeyDown={handleKeyDown}
			>
				{values.filter(Boolean).map((v: T) => (
					<SelectBubble<T & { description?: unknown }>
						item={v as T & { description?: unknown }}
						key={itemToString(v)}
						itemToString={itemToString}
						onRemove={onRemove}
					/>
				))}
				<div className={styles.inputContainer}>
					<input
						{...inputProps}
						disabled={disabled || inputProps.disabled}
						autoComplete="off"
						ref={searchRef}
						size={inputSize}
					/>
				</div>
			</div>
		</FormGroup>
	);
};

const toValueArray = <T,>(raw: unknown): T[] => {
	if (Array.isArray(raw)) {
		return raw as T[];
	}
	if (raw) {
		return [raw as T];
	}
	return [];
};

const WritableSelect = forwardRef(ReflessWritableSelect) as <T>(
	props: WritableSelectProps<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => React.ReactElement;

const getObjectIdent = (option: SearchOption) => option.id;
const getObjectTitle = (option: SearchOption) => option.title;
const createOption = (str: string): SearchOption => ({ id: str, title: str });

type SearchInputProps<T extends SearchOption = SearchOption> = {
	allowNew?: boolean;
	collection: string;
	itemToString?: (option: T) => string;
	optionToString?: (option: T) => string;
	optionToIdent?: (option: T) => string | number;
	multiple?: boolean;
	name: string;
	stringToOption?: (str: string) => T;

	disabled?: boolean;
	label: string;
	required?: boolean;

	[key: string]: unknown;
};

const ReflessSearchInput = <T extends SearchOption = SearchOption>(
	{
		allowNew = false,
		collection,
		itemToString = getObjectTitle as (o: T) => string,
		optionToString = getObjectTitle as (o: T) => string,
		optionToIdent = getObjectIdent as (o: T) => string | number,
		multiple = false,
		name,
		stringToOption = createOption as (s: string) => T,
		disabled,
		label,
		required,
		...props
	}: SearchInputProps<T>,
	ref: ForwardedRef<HTMLInputElement>,
) => {
	const { watch, setValue } = useFormContext();
	const fetch = useFetch();
	const mounted = useMounted();

	const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState<T[]>([]);

	const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const equals = (a: T, b: T) => itemToString(a) === itemToString(b);
	const optionEquals = (a: T, b: T) => optionToString(a) === optionToString(b);

	const currentValue = watch(name) as unknown;
	const selectedItems: T[] = useMemo(() => {
		if (multiple) {
			return (Array.isArray(currentValue) ? (currentValue as T[]) : []) ?? [];
		}
		return currentValue ? ([currentValue as T] as T[]) : [];
	}, [currentValue, multiple]);

	const handleRemove = (item: T) => {
		if (multiple) {
			setValue(
				name,
				selectedItems.filter((i) => !equals(i, item)),
			);
		} else {
			setValue(name, null);
		}
	};

	const queryBackend = async (inputValue: string) => {
		try {
			const query = String(inputValue).trim();
			const data = (await fetch(`/${collection}?q=${encodeURIComponent(query)}`)) as OptionsResponse<T>;

			const base = (data?.results ?? []) as T[];
			const next: T[] =
				allowNew && query
					? [...base, stringToOption(query)].filter(
							(item, index, src) => src.findIndex((i) => optionEquals(i, item)) === index,
						)
					: base;

			if (mounted.current) {
				setOptions(next);
			}
		} finally {
			if (mounted.current) {
				setLoading(false);
			}
		}
	};

	useEffect(
		() => () => {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current);
			}
		},
		[],
	);

	const handleSearch = ({ inputValue }: { inputValue: string }) => {
		setLoading(true);
		if (searchTimeout.current) {
			clearTimeout(searchTimeout.current);
		}
		searchTimeout.current = setTimeout(() => queryBackend(inputValue), TYPING_THROTTLE);
	};

	const handleRemoveLast = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		if (e.key === "Backspace" && !target.value) {
			const last = selectedItems.at(-1);
			if (last) {
				handleRemove(last);
			}
		}
	};

	const combobox = useCombobox<T>({
		defaultHighlightedIndex: 0,
		items: options,
		itemToString: (item: T | null) => (item ? itemToString(item) : ""),
		onInputValueChange: ({ inputValue }) => handleSearch({ inputValue: String(inputValue ?? "") }),
		onSelectedItemChange: ({ selectedItem }) => {
			if (!selectedItem) {
				return;
			}

			if (!multiple) {
				setValue(name, selectedItem);
				return;
			}

			const exists = selectedItems.some((item) => equals(item, selectedItem));
			if (!exists) {
				setValue(name, [...selectedItems, selectedItem]);
			}
		},
		stateReducer: (state, actionAndChanges) => {
			const { changes, type } = actionAndChanges;
			switch (type) {
				case useCombobox.stateChangeTypes.InputKeyDownEnter:
				case useCombobox.stateChangeTypes.ItemClick:
					return {
						...changes,
						highlightedIndex: state.highlightedIndex,
						inputValue: "",
					};
				case useCombobox.stateChangeTypes.InputBlur:
					return {
						...changes,
						inputValue: "",
					};
				default:
					return changes;
			}
		},
	});

	const inputProps = combobox.getInputProps({
		onKeyDown: handleRemoveLast,
		disabled: disabled,
	});

	return (
		<div {...combobox.getToggleButtonProps()} {...(props as Record<string, unknown>)}>
			<WritableSelect<T>
				disabled={disabled}
				itemToString={itemToString}
				label={label}
				onRemove={handleRemove}
				parentName={name}
				required={required}
				inputProps={inputProps}
				ref={ref}
			/>
			<div {...combobox.getMenuProps()}>
				<DropdownMenu show={combobox.isOpen}>
					{options.map((item, index) => (
						<DropdownItem
							active={index === combobox.highlightedIndex}
							key={String(optionToIdent(item))}
							{...combobox.getItemProps({ item: item, index: index })}
						>
							{optionToString(item)}
						</DropdownItem>
					))}
					{!allowNew && <SearchEmpty query={String(inputProps.value ?? "")} show={options.length === 0 && !loading} />}
					<SearchLoader show={loading} />
				</DropdownMenu>
			</div>
		</div>
	);
};

// biome-ignore lint/suspicious/noExplicitAny: Generic forwardRef requires any cast for TypeScript compatibility
export const SearchInput = forwardRef(ReflessSearchInput as any) as <T extends SearchOption = SearchOption>(
	props: SearchInputProps<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => React.ReactElement;
