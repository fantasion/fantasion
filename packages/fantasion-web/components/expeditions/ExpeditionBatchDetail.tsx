import { Col, Container, Row } from "@fantasion/ui";
import { Heading } from "@/content/Heading";
import { DateRange } from "@/datetime/DateRange";
import { Breadcrumbs } from "@/layout/Breadcrumbs";
import { slug } from "@/slugs";
import { useTranslation } from "../../lib/i18n-context";
import { LeisureCentreStub } from "../leisureCentres";
import type { MediaObjectType } from "../media";
import { BatchTroops, Team } from "./batches";
import type { Troop } from "./troops";

type Expedition = {
	id: number;
	title: string;
	description?: string;
	[key: string]: unknown;
};

type CaretakerType = {
	id: number | string;
	profile: {
		id: number;
		title: string;
		jobTitle?: string;
		avatar?: { localPhoto?: Record<string, string>; [key: string]: unknown } | null;
		[key: string]: unknown;
	};
	role: {
		title: string;
		[key: string]: unknown;
	};
	[key: string]: unknown;
};

type Location = {
	[key: string]: unknown;
};

type LeisureCentreType = {
	id: number;
	title: string;
	description?: string;
	detailedDescription?: string;
	location: Location;
	mailingAddress?: Location;
	media: MediaObjectType[];
	expeditions: { id: number; title: string }[];
};

type ExpeditionBatch = {
	id: number;
	startsAt: string;
	endsAt: string;

	leisureCentre?: LeisureCentreType;
	troops: Troop[];
	staff: CaretakerType[];
	expeditionId: number;
	[key: string]: unknown;
};

type ExpeditionBatchDetailProps = {
	expedition: Expedition;
	expeditionBatch: ExpeditionBatch;
};

export function ExpeditionBatchDetail({ expedition, expeditionBatch }: ExpeditionBatchDetailProps) {
	const batch = expeditionBatch;
	const { t } = useTranslation();
	return (
		<Container as="article" className="mt-3">
			<Breadcrumbs
				links={[
					{ route: "adventureList", children: t("adventures-title") },
					{
						route: "expeditionDetail",
						params: { expeditionSlug: slug(Number(expedition.id), expedition.title) },
						children: expedition.title,
					},
					{
						children: <DateRange start={expeditionBatch.startsAt} end={expeditionBatch.endsAt} />,
					},
				]}
			/>
			<header>
				<Heading level={1}>{expedition.title}</Heading>
				<p className="fs-3">
					<DateRange start={batch.startsAt} end={batch.endsAt} />
				</p>
			</header>
			<Row>
				<BatchTroops batch={batch} expedition={expedition} troops={batch.troops} />
				<Col md={6} lg={5} xl={6} className="mt-3">
					<LeisureCentreStub leisureCentre={batch.leisureCentre} />
				</Col>
			</Row>
			<Team team={batch.staff} />
		</Container>
	);
}
