"use client";

import { observeMotion } from "@home/lib/motion";
import type { ComponentPropsWithoutRef } from "react";

/** Server-rendered children, one client-owned visibility observer. */
export function MotionScope(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} ref={observeMotion} />;
}
