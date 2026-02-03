import { Col, Row } from "@fantasion/ui";
import { Heading } from "@/content/Heading";
import { Link } from "@/content/links";
import { slug } from "@/slugs";
import { useTranslation } from "../../lib/i18n-context";
import { ProfileAvatar } from "../profiles";
import styles from "./batches.module.scss";
import { type Troop, TroopCard } from "./troops";

type Batch = {
	id: number;
	startsAt: string;
	endsAt: string;
	troops: Troop[];
	[key: string]: unknown;
};

type Expedition = {
	id: number;
	title: string;
	[key: string]: unknown;
};

type Role = {
	title: string;
	[key: string]: unknown;
};

type AvatarType = {
	localPhoto?: Record<string, string>;
	[key: string]: unknown;
};

type Profile = {
	id: number;
	title: string;
	jobTitle?: string;
	avatar?: AvatarType | null;
	[key: string]: unknown;
};

type CaretakerType = {
	id: number | string;
	profile: Profile;
	role: Role;
	[key: string]: unknown;
};

type TroopWithPrices = {
	prices: { active: boolean }[];
	[key: string]: unknown;
};

type BatchLike = {
	troops: TroopWithPrices[];
	[key: string]: unknown;
};

export const isBatchAvailable = (batch: BatchLike) =>
	batch.troops.some((troop) => troop.prices.some((price) => price.active));

export const BatchTroops = ({
	expedition,
	batch,
	troops,
}: {
	expedition: Expedition;
	batch: Batch;
	troops: Troop[];
}) => (
	<>
		{troops.map((troop: Troop) => (
			<Col md={6} lg={5} xl={4} key={troop.id} className="mt-3">
				<TroopCard expedition={expedition} batch={batch} key={troop.id} troop={troop} />
			</Col>
		))}
	</>
);

const Caretaker = ({ profile, role }: { profile: Profile; role: Role }) => (
	<Link className={styles.caretaker} route="profileDetail" params={{ profileSlug: slug(profile) }}>
		<div className={styles.avatar}>
			<ProfileAvatar avatar={profile.avatar} className={styles.avatar} />
		</div>
		<div>
			<div className={styles.role}>{role.title}</div>
			<div className={styles.name}>{profile.title}</div>
			<div className={styles.title}>{profile.jobTitle}</div>
		</div>
	</Link>
);

export const Team = ({ team }: { team: CaretakerType[] }) => {
	const { t } = useTranslation();
	return (
		<section className="mt-3">
			<Heading level={2}>{t("batch-team")}</Heading>
			<p>{t("batch-team-general-info")}</p>
			<Row className="mt-3">
				{team.map((caretaker: CaretakerType) => (
					<Col key={caretaker.id} md={6} lg={4} xl={3}>
						<Caretaker profile={caretaker.profile} role={caretaker.role} />
					</Col>
				))}
			</Row>
		</section>
	);
};
