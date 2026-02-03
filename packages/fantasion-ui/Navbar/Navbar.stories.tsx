import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Container } from "../grid/Container/index.js";
import {
	Navbar,
	NavbarBrand,
	NavbarCollapse,
	NavbarContainer,
	NavbarNav,
	NavbarNavItem,
	NavbarNavLink,
	NavbarText,
	NavbarToggler,
} from "./Navbar.js";

const meta: Meta<typeof Navbar> = {
	title: "Components/Navbar",
	component: Navbar,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

const NavbarDemo = ({ colorScheme = "light" }: { colorScheme?: "light" | "dark" | "primary" }) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<Navbar expand="lg" colorScheme={colorScheme} expanded={expanded} onToggle={setExpanded}>
			<NavbarContainer>
				<NavbarBrand href="#">Brand</NavbarBrand>
				<NavbarToggler />
				<NavbarCollapse>
					<NavbarNav>
						<NavbarNavItem>
							<NavbarNavLink href="#" active={true}>
								Home
							</NavbarNavLink>
						</NavbarNavItem>
						<NavbarNavItem>
							<NavbarNavLink href="#">Features</NavbarNavLink>
						</NavbarNavItem>
						<NavbarNavItem>
							<NavbarNavLink href="#">Pricing</NavbarNavLink>
						</NavbarNavItem>
						<NavbarNavItem>
							<NavbarNavLink href="#" disabled={true}>
								Disabled
							</NavbarNavLink>
						</NavbarNavItem>
					</NavbarNav>
					<NavbarText>Navbar Text</NavbarText>
				</NavbarCollapse>
			</NavbarContainer>
		</Navbar>
	);
};

export const Default: Story = {
	render: () => <NavbarDemo />,
};

export const Dark: Story = {
	render: () => <NavbarDemo colorScheme="dark" />,
};

export const Primary: Story = {
	render: () => <NavbarDemo colorScheme="primary" />,
};

export const WithBrandOnly: Story = {
	render: () => (
		<Navbar>
			<Container>
				<NavbarBrand href="#">Brand Only</NavbarBrand>
			</Container>
		</Navbar>
	),
};
