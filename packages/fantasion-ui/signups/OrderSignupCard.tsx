import type { ComponentType, ReactNode } from "react";
import { Card, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row } from "../index";

export type SignupData = {
	id: number | string;
	participantName: ReactNode;
	title: string;
	subtitle: string;
	dateRange: ReactNode;
	price: ReactNode;
};

export type OrderSignupCardProps = {
	signup: SignupData;
	onCancel?: (signup: SignupData) => void;
	cancelIcon?: ComponentType;
	renderCancelButton?: (onClick: () => void, icon?: ComponentType) => ReactNode;
};

export const OrderSignupCard = ({ signup, onCancel, cancelIcon, renderCancelButton }: OrderSignupCardProps) => (
	<Card>
		<CardHeader className="d-flex justify-content-between">
			<CardTitle className="mb-0">{signup.participantName}</CardTitle>
			{onCancel && renderCancelButton && renderCancelButton(() => onCancel(signup), cancelIcon)}
		</CardHeader>

		<ListGroup flush={true}>
			<ListGroupItem>{signup.title}</ListGroupItem>
			<ListGroupItem>{signup.dateRange}</ListGroupItem>
			<ListGroupItem>{signup.price}</ListGroupItem>
		</ListGroup>
	</Card>
);

export type OrderSignupsGridProps = {
	signups: SignupData[];
	onCancelSignup?: (signup: SignupData) => void;
	cancelIcon?: ComponentType;
	renderCancelButton?: (onClick: () => void, icon?: ComponentType) => ReactNode;
};

export const OrderSignupsGrid = ({
	signups,
	onCancelSignup,
	cancelIcon,
	renderCancelButton,
}: OrderSignupsGridProps) => (
	<Row>
		{signups.map((signup: SignupData) => (
			<Col key={signup.id} xl={2} lg={3} md={4} sm={6} className="mt-3">
				<OrderSignupCard
					signup={signup}
					onCancel={onCancelSignup}
					cancelIcon={cancelIcon}
					renderCancelButton={renderCancelButton}
				/>
			</Col>
		))}
	</Row>
);
