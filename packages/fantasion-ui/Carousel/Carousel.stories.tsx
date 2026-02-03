import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Carousel, CarouselCaption, CarouselItem } from "./Carousel.js";

const meta: Meta<typeof Carousel> = {
	title: "Components/Carousel",
	component: Carousel,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

const slideStyle: React.CSSProperties = {
	backgroundColor: "#6c757d",
	color: "white",
	padding: "5rem 2rem",
	textAlign: "center",
};

export const Default: Story = {
	render: () => (
		<Carousel>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>First Slide</h3>
					<p>First slide content</p>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>Second Slide</h3>
					<p>Second slide content</p>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>Third Slide</h3>
					<p>Third slide content</p>
				</div>
			</CarouselItem>
		</Carousel>
	),
};

export const WithCaptions: Story = {
	render: () => (
		<Carousel>
			<CarouselItem>
				<div style={{ ...slideStyle, position: "relative" }}>
					<CarouselCaption>
						<h5>First Slide Label</h5>
						<p>Some representative placeholder content for the first slide.</p>
					</CarouselCaption>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={{ ...slideStyle, position: "relative" }}>
					<CarouselCaption>
						<h5>Second Slide Label</h5>
						<p>Some representative placeholder content for the second slide.</p>
					</CarouselCaption>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={{ ...slideStyle, position: "relative" }}>
					<CarouselCaption>
						<h5>Third Slide Label</h5>
						<p>Some representative placeholder content for the third slide.</p>
					</CarouselCaption>
				</div>
			</CarouselItem>
		</Carousel>
	),
};

export const Controlled: Story = {
	render: () => {
		const [index, setIndex] = useState(0);

		return (
			<div>
				<p>Current slide: {index + 1}</p>
				<Carousel activeIndex={index} onSelect={setIndex}>
					<CarouselItem>
						<div style={slideStyle}>
							<h3>First Slide</h3>
						</div>
					</CarouselItem>
					<CarouselItem>
						<div style={slideStyle}>
							<h3>Second Slide</h3>
						</div>
					</CarouselItem>
					<CarouselItem>
						<div style={slideStyle}>
							<h3>Third Slide</h3>
						</div>
					</CarouselItem>
				</Carousel>
			</div>
		);
	},
};

export const NoControls: Story = {
	render: () => (
		<Carousel controls={false}>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>First Slide</h3>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>Second Slide</h3>
				</div>
			</CarouselItem>
		</Carousel>
	),
};

export const NoIndicators: Story = {
	render: () => (
		<Carousel indicators={false}>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>First Slide</h3>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>Second Slide</h3>
				</div>
			</CarouselItem>
		</Carousel>
	),
};

export const FadeTransition: Story = {
	render: () => (
		<Carousel fade={true}>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>First Slide</h3>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>Second Slide</h3>
				</div>
			</CarouselItem>
			<CarouselItem>
				<div style={slideStyle}>
					<h3>Third Slide</h3>
				</div>
			</CarouselItem>
		</Carousel>
	),
};
