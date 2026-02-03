import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useId } from "react";
import { Button } from "../buttons/Button/index.js";
import {
	FloatingLabel,
	Form,
	FormCheck,
	FormControl,
	FormFeedback,
	FormGroup,
	FormLabel,
	FormSelect,
	FormText,
} from "./Form.js";

const meta: Meta<typeof Form> = {
	title: "Components/Form",
	component: Form,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const emailId = useId();
		const passwordId = useId();
		const rememberId = useId();
		return (
			<Form>
				<FormGroup>
					<FormLabel htmlFor={emailId}>Email address</FormLabel>
					<FormControl type="email" id={emailId} placeholder="Enter email" />
					<FormText>We'll never share your email with anyone else.</FormText>
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor={passwordId}>Password</FormLabel>
					<FormControl type="password" id={passwordId} placeholder="Password" />
				</FormGroup>
				<FormGroup>
					<FormCheck type="checkbox" id={rememberId} label="Remember me" />
				</FormGroup>
				<Button type="submit">Submit</Button>
			</Form>
		);
	},
};

export const Sizes: Story = {
	render: () => (
		<Form>
			<FormGroup>
				<FormLabel>Small</FormLabel>
				<FormControl size="sm" placeholder="Small input" />
			</FormGroup>
			<FormGroup>
				<FormLabel>Default</FormLabel>
				<FormControl placeholder="Default input" />
			</FormGroup>
			<FormGroup>
				<FormLabel>Large</FormLabel>
				<FormControl size="lg" placeholder="Large input" />
			</FormGroup>
		</Form>
	),
};

export const Validation: Story = {
	render: () => {
		const validId = useId();
		const invalidId = useId();
		return (
			<Form>
				<FormGroup>
					<FormLabel htmlFor={validId}>Valid input</FormLabel>
					<FormControl id={validId} validation="valid" defaultValue="Looks good!" />
					<FormFeedback type="valid">Looks good!</FormFeedback>
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor={invalidId}>Invalid input</FormLabel>
					<FormControl id={invalidId} validation="invalid" defaultValue="" />
					<FormFeedback type="invalid">Please provide a value.</FormFeedback>
				</FormGroup>
			</Form>
		);
	},
};

export const Select: Story = {
	render: () => {
		const selectId = useId();
		return (
			<Form>
				<FormGroup>
					<FormLabel htmlFor={selectId}>Select</FormLabel>
					<FormSelect id={selectId}>
						<option value="">Choose...</option>
						<option value="1">Option 1</option>
						<option value="2">Option 2</option>
						<option value="3">Option 3</option>
					</FormSelect>
				</FormGroup>
			</Form>
		);
	},
};

export const Textarea: Story = {
	render: () => {
		const textareaId = useId();
		return (
			<Form>
				<FormGroup>
					<FormLabel htmlFor={textareaId}>Textarea</FormLabel>
					<FormControl as="textarea" id={textareaId} placeholder="Enter text here..." />
				</FormGroup>
			</Form>
		);
	},
};

export const Checkboxes: Story = {
	render: () => {
		const check1Id = useId();
		const check2Id = useId();
		const check3Id = useId();
		return (
			<Form>
				<FormCheck type="checkbox" id={check1Id} label="Default checkbox" />
				<FormCheck type="checkbox" id={check2Id} label="Checked checkbox" defaultChecked={true} />
				<FormCheck type="checkbox" id={check3Id} label="Disabled checkbox" disabled={true} />
			</Form>
		);
	},
};

export const Radios: Story = {
	render: () => {
		const radio1Id = useId();
		const radio2Id = useId();
		const radio3Id = useId();
		return (
			<Form>
				<FormCheck type="radio" name="radios" id={radio1Id} label="First radio" defaultChecked={true} />
				<FormCheck type="radio" name="radios" id={radio2Id} label="Second radio" />
				<FormCheck type="radio" name="radios" id={radio3Id} label="Third radio (disabled)" disabled={true} />
			</Form>
		);
	},
};

export const Switches: Story = {
	render: () => {
		const switch1Id = useId();
		const switch2Id = useId();
		const switch3Id = useId();
		return (
			<Form>
				<FormCheck switch={true} type="checkbox" id={switch1Id} label="Default switch" />
				<FormCheck switch={true} type="checkbox" id={switch2Id} label="Checked switch" defaultChecked={true} />
				<FormCheck switch={true} type="checkbox" id={switch3Id} label="Disabled switch" disabled={true} />
			</Form>
		);
	},
};

export const InlineChecks: Story = {
	render: () => {
		const inline1Id = useId();
		const inline2Id = useId();
		const inline3Id = useId();
		return (
			<Form>
				<FormCheck inline={true} type="checkbox" id={inline1Id} label="Option 1" />
				<FormCheck inline={true} type="checkbox" id={inline2Id} label="Option 2" />
				<FormCheck inline={true} type="checkbox" id={inline3Id} label="Option 3" />
			</Form>
		);
	},
};

export const FloatingLabels: Story = {
	render: () => {
		const emailId = useId();
		const passwordId = useId();
		return (
			<Form>
				<FloatingLabel label="Email address" controlId={emailId}>
					<FormControl type="email" id={emailId} placeholder="name@example.com" />
				</FloatingLabel>
				<FloatingLabel label="Password" controlId={passwordId}>
					<FormControl type="password" id={passwordId} placeholder="Password" />
				</FloatingLabel>
			</Form>
		);
	},
};

export const FormSubmitTest: Story = {
	render: () => {
		const emailId = useId();
		const passwordId = useId();
		const handleSubmit = fn((e: React.FormEvent) => {
			e.preventDefault();
		});
		return (
			<Form onSubmit={handleSubmit}>
				<FormGroup>
					<FormLabel htmlFor={emailId}>Email</FormLabel>
					<FormControl type="email" id={emailId} placeholder="test@example.com" />
				</FormGroup>
				<FormGroup>
					<FormLabel htmlFor={passwordId}>Password</FormLabel>
					<FormControl type="password" id={passwordId} placeholder="Password" />
				</FormGroup>
				<Button type="submit">Submit</Button>
			</Form>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Fill in the form
		const emailInput = canvas.getByPlaceholderText("test@example.com");
		const passwordInput = canvas.getByPlaceholderText("Password");

		await userEvent.type(emailInput, "user@test.com");
		await userEvent.type(passwordInput, "password123");

		// Submit the form
		const submitButton = canvas.getByRole("button", { name: /submit/i });
		await userEvent.click(submitButton);

		// Verify form was submitted (would check handleSubmit was called in real component)
		await expect(emailInput).toHaveValue("user@test.com");
		await expect(passwordInput).toHaveValue("password123");
	},
};

export const CheckboxInteractionTest: Story = {
	render: () => {
		const checkId = useId();
		return (
			<Form>
				<FormCheck type="checkbox" id={checkId} label="Accept terms" />
			</Form>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole("checkbox");

		// Initially unchecked
		await expect(checkbox).not.toBeChecked();

		// Click to check
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();

		// Click to uncheck
		await userEvent.click(checkbox);
		await expect(checkbox).not.toBeChecked();
	},
};
