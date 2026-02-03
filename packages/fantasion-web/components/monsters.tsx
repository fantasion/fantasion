"use client";

import { Card, CardBody, CardText, CardTitle, Col, Container, Row } from "@fantasion/ui";
import classnames from "classnames";
import type React from "react";
import { useEffect, useState } from "react";
import { Article } from "../content/Article";
import { Link } from "../content/links";
import { slug } from "../slugs";
import type { MediaObjectType } from "./media";
import styles from "./monsters.module.scss";

const MAX_AVATAR_DELAY_MS = 2000;

type Avatar = {
	galleryThumb?: string;
	[key: string]: unknown;
};

type Monster = {
	id: number;
	title: string;
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
	<div className={classnames("bg-secondary p-4 text-secondary", className)} />
);

type MonsterAvatarProps = {
	as?: React.ElementType;
	avatar?: Avatar | null;
	className?: string;
	alt?: string;
};

export const MonsterAvatar = ({ as: Component = "img", avatar, className, alt }: MonsterAvatarProps) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => setShow(true), Math.random() * MAX_AVATAR_DELAY_MS);
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

type MonsterListItemProps = {
	monster: Monster;
};

const MonsterListItem = ({ monster }: MonsterListItemProps) => (
	<Link as={Card} route="monsterDetail" params={{ monsterSlug: slug(monster) }}>
		<MonsterAvatar avatar={monster.avatar} />
		<CardBody>
			<CardTitle>{monster.title}</CardTitle>
			<CardText>
				<i>{monster.description}</i>
			</CardText>
		</CardBody>
	</Link>
);

type MonsterListProps = {
	monsters: Monster[];
};

export const MonsterList = ({ monsters }: MonsterListProps) => (
	<Row>
		{monsters.map((monster: Monster) => (
			<Col className="mt-3" key={monster.id} xs={6} sm={6} md={4} lg={3} xl={2}>
				<MonsterListItem monster={monster} />
			</Col>
		))}
	</Row>
);

type MonsterDetailProps = {
	monster: Monster;
};

export const MonsterDetail = ({ monster }: MonsterDetailProps) => (
	<Container>
		<Article title={monster.title} description={monster.description} media={monster.media} text={monster.text} />
	</Container>
);
