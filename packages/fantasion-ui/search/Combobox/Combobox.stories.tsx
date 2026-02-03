import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import type { ComboboxOption } from "./Combobox.js";
import { Combobox } from "./Combobox.js";

const meta: Meta<typeof Combobox> = {
	title: "Search/Combobox",
	component: Combobox,
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Field label",
		},
		loading: {
			control: "boolean",
			description: "Whether results are loading",
		},
		disabled: {
			control: "boolean",
			description: "Whether the input is disabled",
		},
		multiple: {
			control: "boolean",
			description: "Allow multiple selections",
			table: { defaultValue: { summary: "true" } },
		},
		required: {
			control: "boolean",
			description: "Whether field is required",
		},
		allowNew: {
			control: "boolean",
			description: "Allow creating new options from typed text",
		},
		emptyMessage: {
			control: "text",
			description: "Message shown when no results found",
		},
		loadingMessage: {
			control: "text",
			description: "Message shown while loading",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems: ComboboxOption[] = [
	{ id: 1, label: "JavaScript", description: "A programming language" },
	{ id: 2, label: "TypeScript", description: "JavaScript with types" },
	{ id: 3, label: "Python", description: "A versatile language" },
	{ id: 4, label: "Rust", description: "Systems programming" },
	{ id: 5, label: "Go", description: "Simple and efficient" },
];

export const Default: Story = {
	args: {
		items: sampleItems,
		selectedItems: [],
		label: "Select programming languages",
		onSelect: fn(),
		onRemove: fn(),
		onInputChange: fn(),
	},
};

export const WithSelectedItems: Story = {
	args: {
		items: sampleItems,
		selectedItems: [sampleItems[0], sampleItems[1]],
		label: "Select programming languages",
		onSelect: fn(),
		onRemove: fn(),
		onInputChange: fn(),
	},
};

export const Loading: Story = {
	args: {
		items: [],
		selectedItems: [],
		label: "Search for languages",
		loading: true,
		onSelect: fn(),
		onRemove: fn(),
		onInputChange: fn(),
	},
};

export const Empty: Story = {
	args: {
		items: [],
		selectedItems: [],
		label: "Search for languages",
		emptyMessage: "No matching languages found",
		onSelect: fn(),
		onRemove: fn(),
		onInputChange: fn(),
	},
};

export const Disabled: Story = {
	args: {
		items: sampleItems,
		selectedItems: [sampleItems[0]],
		label: "Select programming languages",
		disabled: true,
		onSelect: fn(),
		onRemove: fn(),
		onInputChange: fn(),
	},
};

export const SingleSelect: Story = {
	args: {
		items: sampleItems,
		selectedItems: [],
		label: "Select a language",
		multiple: false,
		onSelect: fn(),
		onRemove: fn(),
		onInputChange: fn(),
	},
};

export const Required: Story = {
	args: {
		items: sampleItems,
		selectedItems: [],
		label: "Select at least one language",
		required: true,
		onSelect: fn(),
		onRemove: fn(),
		onInputChange: fn(),
	},
};

// Interactive example with state management
const InteractiveCombobox = () => {
	const [items, setItems] = useState<ComboboxOption[]>(sampleItems);
	const [selected, setSelected] = useState<ComboboxOption[]>([]);
	const [loading, setLoading] = useState(false);

	const handleInputChange = (value: string) => {
		if (!value) {
			setItems(sampleItems);
			return;
		}
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			const filtered = sampleItems.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));
			setItems(filtered);
			setLoading(false);
		}, 300);
	};

	const handleSelect = (item: ComboboxOption) => {
		if (!selected.some((s) => s.id === item.id)) {
			setSelected([...selected, item]);
		}
	};

	const handleRemove = (item: ComboboxOption) => {
		setSelected(selected.filter((s) => s.id !== item.id));
	};

	return (
		<Combobox
			items={items}
			selectedItems={selected}
			label="Search and select languages"
			loading={loading}
			onSelect={handleSelect}
			onRemove={handleRemove}
			onInputChange={handleInputChange}
		/>
	);
};

export const Interactive: Story = {
	render: () => <InteractiveCombobox />,
};
