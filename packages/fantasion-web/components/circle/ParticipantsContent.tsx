"use client";

import { useState } from "react";
import { Heading } from "../../content/content";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { type Participant, ParticipantList } from "../family/ParticipantList";
import { ProfileLayout } from "../family/ProfileLayout";

type ParticipantsResponse = {
	results: Participant[];
};

type ParticipantsContentProps = {
	initialParticipants: ParticipantsResponse;
};

export function ParticipantsContent({ initialParticipants }: ParticipantsContentProps) {
	const { t } = useTranslation();
	const [participants, setParticipants] = useState(initialParticipants);
	const title = t("family-participants");

	const updateParticipantsItem = (updatedParticipant: Participant) => {
		setParticipants({
			...participants,
			results: participants.results.map((p) => (p.id === updatedParticipant.id ? updatedParticipant : p)),
		});
	};

	return (
		<ProfileLayout>
			<Breadcrumbs
				links={[
					{
						children: t("my-status"),
						route: "status",
					},
					{
						children: title,
					},
				]}
			/>
			<Heading level={1}>{title}</Heading>
			<ParticipantList {...participants} onParticipantUpdate={updateParticipantsItem} className="mt-3" />
		</ProfileLayout>
	);
}
