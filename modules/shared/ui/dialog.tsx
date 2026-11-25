"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";

/** A small dialog on Base UI (MIT): trigger, popup with a close button, title and description. */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
	className = "",
	children,
	closeLabel = "Close",
	...props
}: ComponentProps<typeof DialogPrimitive.Popup> & { closeLabel?: string }) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Backdrop className="ui-dialog-backdrop" />
			<DialogPrimitive.Popup className={`ui-dialog ${className}`} {...props}>
				{children}
				<DialogPrimitive.Close className="ui-dialog-close">
					<XIcon size={16} aria-hidden="true" />
					<span className="sr-only">{closeLabel}</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Popup>
		</DialogPrimitive.Portal>
	);
}

export function DialogTitle({
	className = "",
	...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
	return <DialogPrimitive.Title className={`ui-dialog-title ${className}`} {...props} />;
}

export function DialogDescription({
	className = "",
	...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description className={`ui-dialog-description ${className}`} {...props} />
	);
}
