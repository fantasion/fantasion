import type { Meta, StoryObj } from "@storybook/react";
import { Nav, NavItem, NavLink } from "../index.js";
import { NavDropdown, NavDropdownDivider, NavDropdownHeader, NavDropdownItem } from "./NavDropdown.js";

const meta: Meta<typeof NavDropdown> = {
	title: "Components/NavDropdown",
	component: NavDropdown,
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
					Home
				</NavLink>
			</NavItem>
			<NavDropdown title="Dropdown">
				<NavDropdownItem as="a" href="#">
					Action
				</NavDropdownItem>
				<NavDropdownItem as="a" href="#">
					Another action
				</NavDropdownItem>
				<NavDropdownDivider />
				<NavDropdownItem as="a" href="#">
					Something else here
				</NavDropdownItem>
			</NavDropdown>
			<NavItem>
				<NavLink href="#">Link</NavLink>
			</NavItem>
		</Nav>
	),
};

export const WithHeader: Story = {
	render: () => (
		<Nav>
			<NavDropdown title="Menu">
				<NavDropdownHeader>Section 1</NavDropdownHeader>
				<NavDropdownItem as="a" href="#">
					First item
				</NavDropdownItem>
				<NavDropdownItem as="a" href="#">
					Second item
				</NavDropdownItem>
				<NavDropdownDivider />
				<NavDropdownHeader>Section 2</NavDropdownHeader>
				<NavDropdownItem as="a" href="#">
					Third item
				</NavDropdownItem>
			</NavDropdown>
		</Nav>
	),
};

export const WithButtons: Story = {
	render: () => (
		<Nav>
			<NavDropdown title="Actions">
				<NavDropdownItem onClick={() => alert("Action 1!")}>Action 1</NavDropdownItem>
				<NavDropdownItem onClick={() => alert("Action 2!")}>Action 2</NavDropdownItem>
				<NavDropdownItem disabled={true}>Disabled action</NavDropdownItem>
			</NavDropdown>
		</Nav>
	),
};

export const Disabled: Story = {
	render: () => (
		<Nav>
			<NavDropdown title="Disabled Dropdown" disabled={true}>
				<NavDropdownItem>You cannot see this</NavDropdownItem>
			</NavDropdown>
		</Nav>
	),
};
