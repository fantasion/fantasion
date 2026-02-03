"use client";

import { useState } from "react";
import { Breadcrumbs } from "../../layout/Breadcrumbs";
import { useTranslation } from "../../lib/i18n-context";
import { type Participant, ParticipantListItem } from "../family/ParticipantList";
import { ProfileLayout } from "../family/ProfileLayout";
import { getFullName } from "../users";

type ParticipantDetailContentProps = {
	initialParticipant: Participant;
};

export function ParticipantDetailContent({ initialParticipant }: ParticipantDetailContentProps) {
	const { t } = useTranslation();
	const [participant, setParticipant] = useState(initialParticipant);
	const title = getFullName(participant);

	return (
		<ProfileLayout>
			<Breadcrumbs
				links={[
					{
						children: t("my-status"),
						route: "status",
					},
					{
						children: t("family-participants"),
						route: "participants",
					},
					{
						children: title,
					},
				]}
			/>
			<ParticipantListItem {...participant} onParticipantUpdate={setParticipant} className="mt-3" />
		</ProfileLayout>
	);
}
