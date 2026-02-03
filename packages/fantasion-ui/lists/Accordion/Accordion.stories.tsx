import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
	Accordion,
	AccordionBody,
	AccordionButton,
	AccordionCollapse,
	AccordionHeader,
	AccordionItem,
} from "./Accordion.js";

const meta: Meta<typeof Accordion> = {
	title: "Components/Accordion",
	component: Accordion,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

const AccordionDemo = ({ alwaysOpen = false }: { alwaysOpen?: boolean }) => {
	const [activeKey, setActiveKey] = useState<string | string[] | null>(alwaysOpen ? ["0"] : "0");

	const handleToggle = (key: string) => {
		if (alwaysOpen) {
			const keys = Array.isArray(activeKey) ? activeKey : activeKey ? [activeKey] : [];
			setActiveKey(keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]);
		} else {
			setActiveKey(activeKey === key ? null : key);
		}
	};

	return (
		<Accordion activeKey={activeKey} onToggle={handleToggle} alwaysOpen={alwaysOpen}>
			<AccordionItem eventKey="0">
				<AccordionHeader>
					<AccordionButton>Accordion Item #1</AccordionButton>
				</AccordionHeader>
				<AccordionCollapse>
					<AccordionBody>This is the first item's accordion body. It is shown by default.</AccordionBody>
				</AccordionCollapse>
			</AccordionItem>
			<AccordionItem eventKey="1">
				<AccordionHeader>
					<AccordionButton>Accordion Item #2</AccordionButton>
				</AccordionHeader>
				<AccordionCollapse>
					<AccordionBody>This is the second item's accordion body. It is hidden by default.</AccordionBody>
				</AccordionCollapse>
			</AccordionItem>
			<AccordionItem eventKey="2">
				<AccordionHeader>
					<AccordionButton>Accordion Item #3</AccordionButton>
				</AccordionHeader>
				<AccordionCollapse>
					<AccordionBody>This is the third item's accordion body. It is also hidden by default.</AccordionBody>
				</AccordionCollapse>
			</AccordionItem>
		</Accordion>
	);
};

export const Default: Story = {
	render: () => <AccordionDemo />,
};

export const AlwaysOpen: Story = {
	render: () => <AccordionDemo alwaysOpen={true} />,
};
