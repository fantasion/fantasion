"use client";

import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	AccordionItem,
	Card,
	CardHeader,
	CardTitle,
	Col,
	ListGroup,
	ListGroupItem,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
} from "@fantasion/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { DateRange } from "@/datetime/DateRange";
import { formatDateRange } from "@/datetime/formatters";
import { CancelIcon } from "../content/icons";
import { Money } from "../content/money/Money";
import { Form } from "../forms/Form";
import { FormControls } from "../forms/FormControls";
import { Input } from "../forms/Input";
import { useTranslation } from "../lib/i18n-context";
import { InteractiveButton } from "./buttons";
import { useActiveOrder, useFetch } from "./context";
import { isBatchAvailable } from "./expeditions/batches";
import { isTroopAvailable } from "./expeditions/troops";
import type { Order, OrderItemType, SignupProduct } from "./orders/types";
import { UserName } from "./users";

type Country = {
	name?: string;
};

type LocationType = {
	name?: string;
	street?: string;
	streetNumber?: string;
	city?: string;
	postalCode?: string;
	country?: Country;
	fuzzyName?: string | null;
	lat?: number;
	lng?: number;
};

type BatchType = {
	id: number;
	startsAt: string;
	endsAt: string;
	leisureCentre?: {
		id: number;
		title: string;
		location?: LocationType | null;
	} | null;
	troops: TroopType[];
};

type AgeGroup = {
	title?: string;
	ageMin: number;
	ageMax: number;
};

type TroopType = {
	id: number;
	ageGroup: AgeGroup;
	startsAt: string;
	endsAt: string;
	priceIncludes?: string | null;
	prices: { active: boolean; [key: string]: unknown }[];
};

type ExpeditionType = {
	id: number;
	title: string;
};

type Participant = {
	id: number;
	firstName?: string;
	lastName?: string;
};

type Signup = {
	id: number;
	participant: Participant;
	price: number;
	troop: {
		startsAt: string;
		endsAt: string;
		ageGroup: AgeGroup;
		batch: {
			expedition: ExpeditionType;
		};
	};
};

/* Order and OrderItem types moved to ./types/orders */

type BatchSelectionProps = {
	batches: BatchType[];
} & React.ComponentProps<typeof Input>;

const BatchSelection = ({ batches, ...props }: BatchSelectionProps) => {
	const { i18n, t } = useTranslation();
	const options = batches.filter(isBatchAvailable).map((batch: BatchType) => ({
		label: formatDateRange(i18n.language, batch.startsAt, batch.endsAt),
		value: String(batch.id),
	}));
	return <Input {...props} label={t("input-expedition-batch")} type="select" options={options} />;
};

const formatTroopLabel = (troop: TroopType) =>
	`${troop.ageGroup.title} (${troop.ageGroup.ageMin} - ${troop.ageGroup.ageMax} let)`;

const useBatch = (batches: BatchType[]): BatchType | undefined => {
	const { watch } = useFormContext();
	const batchId = watch("batchId");
	const numericId = typeof batchId === "string" ? Number.parseInt(batchId, 10) : batchId;
	return batches.find((b) => b.id === numericId);
};

type TroopSelectionProps = {
	batches: BatchType[];
} & React.ComponentProps<typeof Input>;

const TroopSelection = ({ batches, ...props }: TroopSelectionProps) => {
	const { t } = useTranslation();
	const batch = useBatch(batches);
	const options = batch
		? batch.troops
				.filter((troop) => isTroopAvailable(troop))
				.map((troop: TroopType) => ({
					label: formatTroopLabel(troop),
					value: String(troop.id),
				}))
		: [];
	return (
		<Input {...props} disabled={!batch} label={t("input-age-group")} options={options} required={true} type="select" />
	);
};

const GivenNameInput = (props: React.ComponentProps<typeof Input>) => (
	<Input {...props} type="text" label={useTranslation().t("input-given-name")} />
);

const FamilyNameInput = (props: React.ComponentProps<typeof Input>) => (
	<Input {...props} type="text" label={useTranslation().t("input-family-name")} />
);

const DateOfBirthInput = (props: React.ComponentProps<typeof Input>) => {
	const { t } = useTranslation();
	return <Input {...props} type="date" label={t("input-date-of-birth")} />;
};

const NoteInput = (props: React.ComponentProps<typeof Input>) => {
	const { t } = useTranslation();
	return <Input {...props} type="textarea" label={t("input-note")} />;
};

export const ParticipantForm = () => {
	const { watch } = useFormContext();
	const participantId = watch("participantId");
	if (participantId) {
		return null;
	}
	return (
		<>
			<GivenNameInput name="firstName" required={true} />
			<FamilyNameInput name="lastName" required={true} />
			<DateOfBirthInput name="birthdate" required={true} />
		</>
	);
};

type ParticipantSelectionControlsProps = {
	onCancel?: () => void;
};

const ParticipantSelectionControls = ({ onCancel }: ParticipantSelectionControlsProps) => {
	const { t } = useTranslation();
	const { watch } = useFormContext();
	const participantId = watch("participantId");
	return (
		<FormControls onCancel={onCancel} submitLabel={t(participantId ? "signup-next" : "signup-create-participant")} />
	);
};

type ParticipantSelectionProps = {
	participants: Participant[];
	onAddParticipant: (participant: Participant) => void;
	onCancel?: () => void;
	onSubmit: (participant: Participant) => void;
};

export const ParticipantSelection = ({
	participants,
	onAddParticipant,
	onCancel,
	onSubmit,
}: ParticipantSelectionProps) => {
	const { t } = useTranslation();
	const fetch = useFetch();

	const schema = z.object({
		participantId: z.string(),
		legalGuardian: z.literal(true),
	});

	type ParticipantSelectionFormValues = {
		participantId: string;
		legalGuardian: true;
		birthdate?: string;
		firstName?: string;
		lastName?: string;
	};

	const defaultValues: ParticipantSelectionFormValues = {
		participantId: participants[0] ? String(participants[0].id) : "",
		legalGuardian: true,
	};

	const handleSubmit = async (values: ParticipantSelectionFormValues) => {
		const participant = participants.find((p) => p.id === Number.parseInt(values.participantId, 10));
		if (participant) {
			onSubmit(participant);
		} else {
			const newParticipant = await fetch.post("/participants", {
				body: {
					birthdate: values.birthdate,
					firstName: values.firstName,
					lastName: values.lastName,
				},
			});
			onAddParticipant(newParticipant as unknown as Participant);
			onSubmit(newParticipant as unknown as Participant);
		}
	};

	return (
		<Form<ParticipantSelectionFormValues>
			defaultValues={defaultValues}
			onSubmit={handleSubmit}
			resolver={zodResolver(schema)}
		>
			{participants.map((participant: Participant) => (
				<Input
					type="radio"
					name="participantId"
					value={String(participant.id)}
					key={participant.id}
					label={<UserName user={participant} />}
				/>
			))}
			<Input type="radio" name="participantId" value="" label={t("signup-new-participant")} />
			<ParticipantForm />
			<Input type="checkbox" name="legalGuardian" label={t("signup-is-legal-guardian")} required={true} />
			<ParticipantSelectionControls onCancel={onCancel} />
		</Form>
	);
};

type SignupFormValues = {
	batchId: number;
	troopId: number;
	legalGuardian: boolean;
	note?: string;
	participantId?: number | null;
};

type SignupFormProps = {
	batches: BatchType[];
	onCancel?: () => void;
	onSubmit: (values: SignupFormValues) => undefined | Promise<unknown>;
	participantId?: number | null;
};

export const SignupForm = ({ batches, onCancel, onSubmit }: SignupFormProps) => {
	const { t } = useTranslation();
	const defaultValues: SignupFormValues = {
		batchId: batches[0]?.id ?? 0,
		troopId: batches[0]?.troops[0]?.id ?? 0,
		legalGuardian: true,
	};
	return (
		<Form defaultValues={defaultValues} onSubmit={(values: SignupFormValues) => onSubmit(values)}>
			<BatchSelection batches={batches} name="batchId" required={true} />
			<TroopSelection batches={batches} name="troopId" required={true} />
			<NoteInput name="note" />
			<p className="mt-3 text-muted">{t("signup-will-be-added")}</p>
			<FormControls onCancel={onCancel} submitLabel={t("input-save-signup")} />
		</Form>
	);
};

type SignupWizzardProps = {
	batches: BatchType[];
	participants: Participant[];
	onAddParticipant: (participant: Participant) => void;
	onCancel?: () => void;
	onSubmit: (values: SignupFormValues) => undefined | Promise<unknown>;
} & Omit<React.ComponentProps<typeof Accordion>, "onSubmit">;

export const SignupWizzard = ({
	batches,
	participants,
	onAddParticipant,
	onCancel,
	onSubmit,
	...props
}: SignupWizzardProps) => {
	const [participantId, setParticipantId] = useState<number | null>(null);
	const [activeKey, setActiveKey] = useState<string>("1");
	const { t } = useTranslation();
	const selectParticipant = (participant: Participant) => {
		setParticipantId(participant.id);
		setActiveKey("2");
	};
	const handleSubmit = (values: SignupFormValues): undefined => {
		onSubmit({
			...values,
			participantId: participantId,
		});
	};

	return (
		<Accordion {...props} activeKey={activeKey} alwaysOpen={true}>
			<AccordionItem eventKey="1">
				<AccordionHeader onClick={() => setActiveKey("1")}>{t("signup-participant-selection")}</AccordionHeader>
				<AccordionBody>
					<ParticipantSelection
						onAddParticipant={onAddParticipant}
						onCancel={onCancel}
						onSubmit={selectParticipant}
						participants={participants}
					/>
				</AccordionBody>
			</AccordionItem>
			<AccordionItem eventKey="2">
				<AccordionHeader>{t("signup-troop-selection")}</AccordionHeader>
				<AccordionBody>
					<SignupForm batches={batches} onCancel={onCancel} onSubmit={handleSubmit} participantId={participantId} />
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

type OrderSignupProps = {
	onCancel?: (signup: Signup) => void;
	signup: Signup;
};

const OrderSignup = ({ onCancel, signup }: OrderSignupProps) => (
	<Card>
		<CardHeader className="d-flex justify-content-between">
			<CardTitle className="mb-0">
				<UserName user={signup.participant} />
			</CardTitle>
			{onCancel && <InteractiveButton onClick={() => onCancel(signup)} variant="link" icon={CancelIcon} />}
		</CardHeader>

		<ListGroup flush={true}>
			<ListGroupItem>{`${signup.troop.batch.expedition.title}: ${signup.troop.ageGroup.title}`}</ListGroupItem>
			<ListGroupItem>
				<DateRange start={signup.troop.startsAt} end={signup.troop.endsAt} />
			</ListGroupItem>
			<ListGroupItem>
				<Money amount={signup.price} />
			</ListGroupItem>
		</ListGroup>
	</Card>
);

type OrderSignupsProps = {
	onCancelSignup?: (signup: Signup) => void;
	signups: Signup[];
};

export const OrderSignups = ({ onCancelSignup, signups }: OrderSignupsProps) => (
	<Row>
		{signups.map((signup: Signup) => (
			<Col key={signup.id} xl={2} lg={3} md={4} sm={6} className="mt-3">
				<OrderSignup onCancel={onCancelSignup} signup={signup} />
			</Col>
		))}
	</Row>
);

export type SignupDialogProps = {
	expedition: ExpeditionType;
	batch: BatchType;
	batches: BatchType[];
	troop?: TroopType | null;
	participants: Participant[];
	onAddParticipant: (participant: Participant) => void;
	onCancel?: () => void;
	onCreateSignup: (values: SignupFormValues) => undefined | Promise<unknown>;
	onHide: () => void;
	show: boolean;
};

export const SignupDialog = ({
	expedition,
	batch: _batch,
	batches,
	troop: _troop,
	participants,
	onAddParticipant,
	onCancel,
	onCreateSignup,
	onHide,
	show,
}: SignupDialogProps) => {
	const { t } = useTranslation();
	const order = useActiveOrder() as Order | null;
	const unusedParticipants = participants.filter(
		(p) =>
			!(order && (order.items?.some((s: OrderItemType) => p.id === (s as SignupProduct)?.participant?.id) ?? false)),
	);

	const handleSubmit = (values: SignupFormValues): undefined => {
		onCreateSignup(values);
	};

	return (
		<Modal show={show} onHide={onHide}>
			<ModalHeader closeButton={true}>{t("expedition-signup-on", { expeditionTitle: expedition.title })}</ModalHeader>
			<ModalBody>
				<SignupWizzard
					batches={batches}
					className="mt-3"
					participants={unusedParticipants}
					onCancel={onCancel}
					onSubmit={handleSubmit}
					onAddParticipant={onAddParticipant}
				/>
			</ModalBody>
		</Modal>
	);
};
