import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Nav, NavButton, NavItem, NavLink } from "./Nav.js";

const meta: Meta<typeof Nav> = {
	title: "Components/Nav",
	component: Nav,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Nav>
			<NavItem>
				<NavLink href="#" active={true}>
					Active
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#" disabled={true}>
					Disabled
				</NavLink>
			</NavItem>
		</Nav>
	),
};

export const Tabs: Story = {
	render: () => (
		<Nav variant="tabs">
			<NavItem>
				<NavLink href="#" active={true}>
					Active
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#" disabled={true}>
					Disabled
				</NavLink>
			</NavItem>
		</Nav>
	),
};

export const Pills: Story = {
	render: () => (
		<Nav variant="pills">
			<NavItem>
				<NavLink href="#" active={true}>
					Active
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#" disabled={true}>
					Disabled
				</NavLink>
			</NavItem>
		</Nav>
	),
};

export const Vertical: Story = {
	render: () => (
		<Nav variant="pills" vertical={true}>
			<NavItem>
				<NavLink href="#" active={true}>
					Active
				</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
		</Nav>
	),
};

export const WithButtons: Story = {
	render: () => (
		<Nav variant="pills">
			<NavItem>
				<NavButton active={true}>Active</NavButton>
			</NavItem>
			<NavItem>
				<NavButton>Button</NavButton>
			</NavItem>
			<NavItem>
				<NavButton disabled={true}>Disabled</NavButton>
			</NavItem>
		</Nav>
	),
};

export const NavigationTest: Story = {
	render: () => {
		const handleClick = fn();
		return (
			<Nav>
				<NavItem>
					<NavLink href="#home" onClick={handleClick}>
						Home
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="#about" onClick={handleClick}>
						About
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="#contact" onClick={handleClick}>
						Contact
					</NavLink>
				</NavItem>
			</Nav>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Click on About link
		const aboutLink = canvas.getByRole("link", { name: /about/i });
		await userEvent.click(aboutLink);

		// Click on Contact link
		const contactLink = canvas.getByRole("link", { name: /contact/i });
		await userEvent.click(contactLink);
	},
};

export const ButtonClickTest: Story = {
	render: () => {
		const handleClick = fn();
		return (
			<Nav variant="pills">
				<NavItem>
					<NavButton onClick={handleClick}>Click Me</NavButton>
				</NavItem>
				<NavItem>
					<NavButton onClick={handleClick}>Or Me</NavButton>
				</NavItem>
				<NavItem>
					<NavButton disabled={true} onClick={handleClick}>
						Not Me (Disabled)
					</NavButton>
				</NavItem>
			</Nav>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Click enabled buttons
		const button1 = canvas.getByRole("button", { name: /click me/i });
		await userEvent.click(button1);

		const button2 = canvas.getByRole("button", { name: /or me/i });
		await userEvent.click(button2);

		// Verify disabled button is disabled
		const disabledButton = canvas.getByRole("button", { name: /not me/i });
		await expect(disabledButton).toBeDisabled();
	},
};
