"use client";

import {
	Alert,
	type AlertVariant,
	ButtonGroup,
	Container,
	Toast,
	ToastBody,
	ToastContainer,
	ToastHeader,
} from "@fantasion/ui";
import { type ReactNode, useCallback, useState } from "react";
import { v4 } from "uuid";
import { Link } from "../content/links";
import { InteractiveButton } from "./buttons";
import { AlertContext, ToastContext, useAlerts } from "./context";

type EntityItem = {
	id: string;
	[key: string]: unknown;
};

type EntityCollection<T extends EntityItem> = {
	add: (item: Omit<T, "id">) => void;
	empty: boolean;
	remove: (itemId: string) => void;
	items: T[];
};

type AlertProviderProps = {
	children: ReactNode;
};

type ToastActionProps = {
	message: string;
	route: string;
};

type ToastActionsProps = {
	actions: ToastActionProps[];
};

interface ToastItem extends EntityItem {
	actions?: ToastActionProps[];
	message?: string;
	subject: string;
}

type ToastsProps = {
	remove: (itemId: string) => void;
	toasts: ToastItem[];
};

interface AlertItem extends EntityItem {
	severity: AlertVariant;
	text: string;
}

const useEntityCollection = <T extends EntityItem>(): EntityCollection<T> => {
	const [items, setItems] = useState<T[]>([]);
	const add = useCallback((item: Omit<T, "id">) => setItems([...items, { ...item, id: v4() } as T]), [items]);
	const remove = useCallback((itemId: string) => setItems(items.filter((item) => item.id !== itemId)), [items]);
	return { add: add, empty: items.length === 0, remove: remove, items: items };
};

export const AlertProvider = ({ children }: AlertProviderProps) => {
	const alerts = useEntityCollection<AlertItem>();
	const toasts = useEntityCollection<ToastItem>();
	return (
		<ToastContext.Provider value={toasts}>
			<AlertContext.Provider value={alerts}>{children}</AlertContext.Provider>
			<Toasts remove={toasts.remove} toasts={toasts.items} />
		</ToastContext.Provider>
	);
};

const ToastAction = ({ message, route }: ToastActionProps) => (
	<Link as={InteractiveButton} route={route} variant="link">
		{message}
	</Link>
);

const ToastActions = ({ actions }: ToastActionsProps) => (
	<ButtonGroup style={{ width: "100%" }}>
		{actions.map((action) => (
			<ToastAction {...action} key={action.message} />
		))}
	</ButtonGroup>
);

const Toasts = ({ remove, toasts }: ToastsProps) => (
	<ToastContainer position="bottom-center" className="position-fixed">
		{toasts.map(({ actions, id, message, subject }) => (
			<Toast key={id} onClose={() => remove(id)}>
				<ToastHeader closeButton={true}>
					<strong className="me-auto">{subject}</strong>
				</ToastHeader>
				{message && <ToastBody>{message}</ToastBody>}
				{actions && <ToastActions actions={actions} />}
			</Toast>
		))}
	</ToastContainer>
);

export const Alerts = () => {
	const { empty, items, remove } = useAlerts() as EntityCollection<AlertItem>;
	if (empty) {
		return null;
	}
	return (
		<Container>
			{items.map((alert: AlertItem) => (
				<Alert className="m-auto mb-4" key={alert.id} onClose={() => remove(alert.id)} variant={alert.severity}>
					{alert.text}
				</Alert>
			))}
		</Container>
	);
};
