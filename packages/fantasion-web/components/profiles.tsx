"use client";

import { Card, CardBody, CardText, CardTitle, Col, Container, Row } from "@fantasion/ui";
import classnames from "classnames";
import type React from "react";
import { useEffect, useState } from "react";
import { Article } from "../content/Article";
import { Link } from "../content/links";
import { slug } from "../slugs";
import type { MediaObjectType } from "./media";
import styles from "./profiles.module.scss";
import { SiteLogo } from "./SiteLogo";

const MAX_PROFILE_AVATAR_DELAY_MS = 2000;

type Avatar = {
	galleryThumb?: string;
	[key: string]: unknown;
};

export type Profile = {
	id: number;
	title: string;
	jobTitle?: string;
	description?: string;
	text?: string;
	media?: MediaObjectType[];
	avatar?: Avatar | null;
	[key: string]: unknown;
};

type NoAvatarProps = {
	className?: string;
};

const NoAvatar = ({ className }: NoAvatarProps) => (
	<div className={classnames("bg-primary p-4 text-secondary", className)}>
		<SiteLogo />
	</div>
);

type ProfileAvatarProps = {
	as?: React.ElementType;
	avatar?: Avatar | null;
	className?: string;
	alt?: string;
};

export const ProfileAvatar = ({ as: Component = "img", avatar, className, alt }: ProfileAvatarProps) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setShow(true), Math.random() * MAX_PROFILE_AVATAR_DELAY_MS);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className={styles.avatar}>
			<div className={styles.square}>
				<NoAvatar className={styles.noAvatar} />
				{avatar?.galleryThumb ? (
					<Component
						src={avatar.galleryThumb}
						alt={alt}
						className={classnames(styles.realAvatar, className, {
							[styles.visibleAvatar]: show,
						})}
					/>
				) : null}
			</div>
		</div>
	);
};

type ProfileListItemProps = {
	profile: Profile;
};

const ProfileListItem = ({ profile }: ProfileListItemProps) => (
	<Link as={Card} route="profileDetail" params={{ profileSlug: slug(profile) }}>
		<ProfileAvatar avatar={profile.avatar} />
		<CardBody>
			<CardTitle>{profile.title}</CardTitle>
			<CardText>{profile.jobTitle}</CardText>
		</CardBody>
	</Link>
);

type ProfileListProps = {
	profiles: Profile[];
};

export const ProfileList = ({ profiles }: ProfileListProps) => (
	<Row>
		{profiles.map((profile: Profile) => (
			<Col className="mt-3" key={profile.id} xs={6} sm={6} md={4} lg={3} xl={2}>
				<ProfileListItem profile={profile} />
			</Col>
		))}
	</Row>
);

type ProfileDetailProps = {
	profile: Profile;
};

export const ProfileDetail = ({ profile }: ProfileDetailProps) => (
	<Container>
		<Article
			description={profile.description}
			media={profile.media}
			subTitle={profile.jobTitle}
			text={profile.text}
			title={profile.title}
		/>
	</Container>
);
