"use client";

import { Card, CardHeader, Col, ListGroup, ListGroupItem, Row } from "@fantasion/ui";
import { useState } from "react";
import { capitalize } from "../../api";
import { Heading, Section } from "../../content/content";
import { CheckIcon } from "../../content/icons";
import { Link } from "../../content/links";
import { TextTooltip } from "../../content/tooltips";
import { DateLabel } from "../../datetime/DateLabel";
import { useTranslation } from "../../lib/i18n-context";
import { InteractiveButton } from "../buttons";
import { useFetch } from "../context";
import { UserName } from "../users";
import { TraitForm } from "./TraitForm";

export type TraitPropertyType = {
	id: number | string;
	title: string;
	description?: string;
};

export type TraitItemType = Record<string, TraitPropertyType>;

type TraitName = "allergy" | "diet" | "hobby";

type TraitCollectionName = "allergies" | "diets" | "hobbies";

export type Participant = {
	id: number;
	birthdate: string;
	allergies: TraitItemType[];
	diets: TraitItemType[];
	hobbies: TraitItemType[];
	noAllergies: boolean;
	noDiets: boolean;
	noHobbies: boolean;
	firstName?: string | null;
	lastName?: string | null;
	[key: string]: unknown;
};

type ParticipantListItemProps = Participant & {
	onParticipantUpdate: (participant: Participant) => void;
};

type ParticipantListProps = {
	onParticipantUpdate: (participant: Participant) => void;
	results: Participant[];
	[key: string]: unknown;
};

type TraitPropertyProps = {
	title: string;
	description?: string;
};

const TraitProperty = ({ title, description }: TraitPropertyProps) => (
	<TextTooltip tip={description}>{title}</TextTooltip>
);

type TraitStatsProps = {
	items: TraitItemType[];
	trait: TraitName;
};

const TraitStats = ({ items, trait }: TraitStatsProps) =>
	items
		.map((item) => item[trait])
		.reduce<React.ReactNode[]>(
			(aggr, property, index) =>
				aggr.concat([<TraitProperty {...property} key={property.id} />, index < items.length - 1 && ", "]),
			[],
		)
		.filter(Boolean);

type TraitZeroStateProps = {
	onEdit: () => void;
	onSetNone: () => Promise<void> | void;
	trait: TraitName;
};

const TraitZeroState = ({ onEdit, onSetNone, trait }: TraitZeroStateProps) => {
	const [noneLoading, setNoneLoading] = useState(false);
	const { t } = useTranslation();
	const handleSetNone = async () => {
		setNoneLoading(true);
		try {
			await onSetNone();
		} finally {
			setNoneLoading(false);
		}
	};
	return (
		<>
			<InteractiveButton disabled={noneLoading} onClick={onEdit} variant="primary">
				{t(`participant-trait-fill-in-${trait}`)}
			</InteractiveButton>
			<InteractiveButton className="ms-2" variant="secondary" onClick={handleSetNone}>
				{t(`participant-trait-has-no-${trait}`)}
			</InteractiveButton>
		</>
	);
};

type TraitEmptyProps = {
	trait: TraitName;
};

const TraitEmpty = ({ trait }: TraitEmptyProps) => {
	const { t } = useTranslation();
	return (
		<>
			<CheckIcon /> {t(`participant-trait-has-no-${trait}`)}
		</>
	);
};

type TraitStatusProps = {
	none: boolean;
	items: TraitItemType[];
	onEdit: () => void;
	onSetNone: () => Promise<void> | void;
	trait: TraitName;
};

const TraitStatus = ({ none, items, onEdit, onSetNone, trait }: TraitStatusProps) => {
	if (none) {
		return <TraitEmpty trait={trait} />;
	}
	if (items.length === 0) {
		return <TraitZeroState onEdit={onEdit} onSetNone={onSetNone} trait={trait} />;
	}
	return <TraitStats items={items} trait={trait} />;
};

type TraitProps = {
	name: string;
	none: boolean;
	collection: TraitCollectionName;
	onParticipantUpdate: (participant: Participant) => void;
	participantId: number;
	items: TraitItemType[];
	trait: TraitName;
};

const Trait = ({ name, none, collection, onParticipantUpdate, participantId, items, trait }: TraitProps) => {
	const fetch = useFetch();
	const [edit, setEdit] = useState(false);
	const { t } = useTranslation();
	const noneLabel = `no${capitalize(collection)}`;
	const handleSetNone = async () => {
		const updated = (await fetch.patch(`/participants/${participantId}`, {
			body: {
				[noneLabel]: true,
				[collection]: [],
			},
		})) as unknown as Participant;
		onParticipantUpdate(updated);
	};
	if (edit) {
		const handleSubmit = async (values: Record<string, unknown>) => {
			const updated = (await fetch.patch(`/participants/${participantId}`, {
				body: {
					...values,
					[noneLabel]: false,
				},
			})) as unknown as Participant;
			onParticipantUpdate(updated);
			setEdit(false);
		};
		return (
			<ListGroupItem>
				<TraitForm
					collection={collection}
					items={items}
					onCancel={() => setEdit(false)}
					onSetNone={handleSetNone}
					onSubmit={handleSubmit}
					trait={trait}
				/>
			</ListGroupItem>
		);
	}
	const zeroState = !none && items.length === 0;
	const handleEdit = () => setEdit(true);
	const clickHandler = zeroState ? undefined : handleEdit;
	return (
		<ListGroupItem action={!zeroState} onClick={clickHandler}>
			<strong>{t("label-with-colon", { label: name })}</strong>
			<div>
				<TraitStatus trait={trait} items={items} onEdit={handleEdit} onSetNone={handleSetNone} none={none} />
			</div>
		</ListGroupItem>
	);
};

export const ParticipantListItem = ({
	allergies,
	birthdate,
	diets,
	hobbies,
	id,
	noAllergies,
	noDiets,
	noHobbies,
	onParticipantUpdate,
	...props
}: ParticipantListItemProps) => {
	const { t } = useTranslation();
	return (
		<Card as={Section} className="mt-3">
			<CardHeader>
				<Heading level={2}>
					<Link route="participantDetail" params={{ participantId: String(id) }}>
						<UserName user={props} />
					</Link>
				</Heading>
				<div>
					<DateLabel date={birthdate} year="numeric" />
				</div>
			</CardHeader>
			<ListGroup flush={true}>
				<Trait
					name={t("participant-allergies")}
					items={allergies}
					participantId={id}
					none={noAllergies}
					onParticipantUpdate={onParticipantUpdate}
					collection="allergies"
					trait="allergy"
				/>
				<Trait
					name={t("participant-diets")}
					participantId={id}
					items={diets}
					none={noDiets}
					onParticipantUpdate={onParticipantUpdate}
					collection="diets"
					trait="diet"
				/>
				<Trait
					name={t("participant-hobbies")}
					items={hobbies}
					participantId={id}
					none={noHobbies}
					onParticipantUpdate={onParticipantUpdate}
					collection="hobbies"
					trait="hobby"
				/>
			</ListGroup>
		</Card>
	);
};

export const ParticipantList = ({ onParticipantUpdate, results, ...props }: ParticipantListProps) => (
	<Row {...props}>
		{results.map((participant: Participant) => (
			<Col key={participant.id} md={12} lg={6}>
				<ParticipantListItem {...participant} onParticipantUpdate={onParticipantUpdate} />
			</Col>
		))}
	</Row>
);
