"use client";

import clsx from "clsx";
import { useCombobox } from "downshift";
import { forwardRef, type KeyboardEvent, type ReactNode, useCallback, useImperativeHandle, useRef } from "react";
import { FormGroup, FormLabel } from "../../forms/index.js";
import { Spinner } from "../../navigation/Spinner/index.js";
import { DropdownItem, DropdownMenu } from "../../overlays/index.js";
import { SelectBubble } from "../SelectBubble/index.js";
import styles from "./Combobox.module.scss";

export interface ComboboxOption {
	id: string | number;
	label: string;
	description?: string;
}

export interface ComboboxProps<T extends ComboboxOption = ComboboxOption> {
	/** Available options to select from */
	items: T[];
	/** Currently selected items */
	selectedItems: T[];
	/** Convert option to display string */
	itemToString?: (item: T) => string;
	/** Called when an item is selected */
	onSelect: (item: T) => void;
	/** Called when an item is removed */
	onRemove: (item: T) => void;
	/** Called when input value changes (for search) */
	onInputChange: (value: string) => void;
	/** Whether results are loading */
	loading?: boolean;
	/** Whether the input is disabled */
	disabled?: boolean;
	/** Field label */
	label: string;
	/** Whether field is required */
	required?: boolean;
	/** Allow multiple selections */
	multiple?: boolean;
	/** Message shown when no results found */
	emptyMessage?: ReactNode;
	/** Message shown while loading */
	loadingMessage?: ReactNode;
	/** Allow creating new options from typed text */
	allowNew?: boolean;
	/** Icon component for remove button in bubbles */
	removeIcon?: ReactNode;
	/** Additional class name */
	className?: string;
}

const defaultItemToString = <T extends ComboboxOption>(item: T | null) => (item ? item.label : "");

const DEFAULT_INPUT_SIZE = 3;

/**
 * Combobox - An autocomplete dropdown with multi-select support.
 *
 * This is a presentational component that handles the UI for search/select.
 * Data fetching and form integration should be handled by the parent.
 *
 * @example
 * ```tsx
 * <Combobox
 *   items={searchResults}
 *   selectedItems={selected}
 *   onSelect={(item) => setSelected([...selected, item])}
 *   onRemove={(item) => setSelected(selected.filter(s => s.id !== item.id))}
 *   onInputChange={(value) => search(value)}
 *   loading={isSearching}
 *   label="Select tags"
 *   multiple
 * />
 * ```
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
	<T extends ComboboxOption>(
		{
			items,
			selectedItems,
			itemToString = defaultItemToString as (item: T) => string,
			onSelect,
			onRemove,
			onInputChange,
			loading = false,
			disabled = false,
			label,
			required,
			multiple = true,
			emptyMessage = "No results found",
			loadingMessage = "Loading...",
			allowNew = false,
			removeIcon,
			className,
		}: ComboboxProps<T>,
		ref: React.Ref<HTMLInputElement>,
	) => {
		const inputRef = useRef<HTMLInputElement | null>(null);
		useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

		const focusInput = useCallback(() => inputRef.current?.focus(), []);

		const handleRemoveLast = (e: KeyboardEvent<HTMLInputElement>) => {
			const target = e.target as HTMLInputElement;
			if (e.key === "Backspace" && !target.value && selectedItems.length > 0) {
				const last = selectedItems.at(-1);
				if (last) {
					onRemove(last);
				}
			}
		};

		const combobox = useCombobox<T>({
			defaultHighlightedIndex: 0,
			items: items,
			itemToString: (item: T | null) => (item ? itemToString(item) : ""),
			onInputValueChange: ({ inputValue }) => onInputChange(String(inputValue ?? "")),
			onSelectedItemChange: ({ selectedItem }) => {
				if (!selectedItem) {
					return;
				}
				onSelect(selectedItem);
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

		const inputSize =
			String(inputProps.value ?? "").length > 0 ? String(inputProps.value ?? "").length : DEFAULT_INPUT_SIZE;

		const handleContainerClick = () => focusInput();
		const handleContainerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				focusInput();
			}
		};

		const showEmpty = !allowNew && items.length === 0 && !loading;

		return (
			<div {...combobox.getToggleButtonProps()} className={className}>
				<FormGroup>
					<FormLabel className={clsx(styles.label, { [styles.required]: required })}>{label}:</FormLabel>
					<div
						className={clsx("d-flex", styles.inputContainer, {
							[styles.disabled]: disabled,
						})}
						onClick={handleContainerClick}
						onKeyDown={handleContainerKeyDown}
					>
						{multiple &&
							selectedItems.map((item) => (
								<SelectBubble
									key={String(item.id)}
									label={itemToString(item)}
									tooltip={item.description}
									onRemove={() => onRemove(item)}
									removeIcon={removeIcon}
									disabled={disabled}
								/>
							))}
						<div className={styles.inputWrapper}>
							<input
								{...inputProps}
								disabled={disabled || inputProps.disabled}
								autoComplete="off"
								ref={inputRef}
								size={inputSize}
								className={styles.input}
							/>
						</div>
					</div>
				</FormGroup>
				<div {...combobox.getMenuProps()}>
					<DropdownMenu show={combobox.isOpen} className={styles.menu}>
						{items.map((item, index) => (
							<DropdownItem
								active={index === combobox.highlightedIndex}
								key={String(item.id)}
								{...combobox.getItemProps({ item: item, index: index })}
							>
								{itemToString(item)}
							</DropdownItem>
						))}
						{showEmpty && (
							<DropdownItem className={styles.emptyItem} disabled={true}>
								{emptyMessage}
							</DropdownItem>
						)}
						{loading && (
							<DropdownItem className={styles.loadingItem} disabled={true}>
								<Spinner animation="border" role="status" size="sm" className={styles.spinner} />
								{loadingMessage}
							</DropdownItem>
						)}
					</DropdownMenu>
				</div>
			</div>
		);
	},
) as <T extends ComboboxOption = ComboboxOption>(
	props: ComboboxProps<T> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement;

(Combobox as { displayName?: string }).displayName = "Combobox";
