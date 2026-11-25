"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";

type Field = "email" | "intent" | "consent";

/**
 * The early access form. It sends JSON ({ email, intent, locale }) to the URL in
 * NEXT_PUBLIC_SIGNUP_ENDPOINT, for example a Formspree form or your own API route.
 * Without that variable it sends nothing and only shows the success state, so the page
 * can be tried locally.
 */
export function EarlyAccessForm() {
	const t = useTranslations("earlyAccess");
	const locale = useLocale();
	const [errors, setErrors] = useState<Partial<Record<Field | "root", string>>>({});
	const [sending, setSending] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [lockedHeight, setLockedHeight] = useState<number>();

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const email = String(data.get("email") ?? "")
			.trim()
			.toLowerCase();
		const intent = String(data.get("intent") ?? "").trim();
		const next: typeof errors = {};
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
			next.email = t("invalidEmail");
		if (intent.length < 10 || intent.length > 1000) next.intent = t("invalidIntent");
		if (!data.get("consent")) next.consent = t("requiredConsent");
		setErrors(next);
		if (Object.keys(next).length) return;
		// Bots fill the hidden field; people never see it.
		if (data.get("website")) return;
		const height = form.offsetHeight;
		const endpoint = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT;
		setSending(true);
		try {
			if (endpoint) {
				const response = await fetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json", Accept: "application/json" },
					body: JSON.stringify({ email, intent, locale }),
				});
				if (!response.ok) throw new Error("Signup failed");
			} else {
				console.info("NEXT_PUBLIC_SIGNUP_ENDPOINT is not set: the signup was not sent.");
			}
			setLockedHeight(height);
			setSubmitted(true);
		} catch {
			setErrors({ root: t("error") });
		} finally {
			setSending(false);
		}
	};

	if (submitted) {
		return (
			<output
				ref={(node) => node?.focus({ preventScroll: true })}
				tabIndex={-1}
				className="ea-success"
				style={{ minHeight: lockedHeight }}
			>
				<span className="ea-success-icon" aria-hidden="true">
					<Check size={20} strokeWidth={2.6} />
				</span>
				<strong className="ea-success-title">{t("successTitle")}</strong>
				<span className="ea-success-body">{t("successDescription")}</span>
			</output>
		);
	}

	return (
		<form className="ea-form" onSubmit={onSubmit} noValidate>
			<div className="ea-form-intro">
				<h3 className="ea-form-title">{t("title")}</h3>
				<p className="ea-form-description">{t("description")}</p>
			</div>
			{errors.root && (
				<p className="ea-feedback" role="alert">
					{errors.root}
				</p>
			)}
			<div className="ea-field">
				<label htmlFor="ea-email">{t("email")}</label>
				<input
					id="ea-email"
					name="email"
					type="email"
					autoComplete="email"
					maxLength={254}
					placeholder={t("emailPlaceholder")}
					aria-invalid={Boolean(errors.email)}
					aria-describedby={errors.email ? "ea-email-error" : undefined}
				/>
				{errors.email && (
					<p id="ea-email-error" className="ea-error">
						{errors.email}
					</p>
				)}
			</div>
			<div className="ea-field">
				<label htmlFor="ea-intent">{t("intent")}</label>
				<textarea
					id="ea-intent"
					name="intent"
					minLength={10}
					maxLength={1000}
					rows={4}
					placeholder={t("intentPlaceholder")}
					aria-invalid={Boolean(errors.intent)}
					aria-describedby={errors.intent ? "ea-intent-hint ea-intent-error" : "ea-intent-hint"}
				/>
				<p id="ea-intent-hint" className="ea-hint">
					{t("intentHint")}
				</p>
				{errors.intent && (
					<p id="ea-intent-error" className="ea-error">
						{errors.intent}
					</p>
				)}
			</div>
			<div className="ea-consent">
				<div className="ea-consent-row">
					<input
						id="ea-consent"
						name="consent"
						type="checkbox"
						className="ea-checkbox"
						aria-invalid={Boolean(errors.consent)}
					/>
					<label htmlFor="ea-consent">{t("consent")}</label>
				</div>
				{errors.consent && <p className="ea-error">{errors.consent}</p>}
			</div>
			<div className="ea-honeypot" aria-hidden="true">
				<label htmlFor="ea-website">Website</label>
				<input id="ea-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
			</div>
			<button type="submit" className="ea-submit" disabled={sending}>
				{t("submit")}
			</button>
		</form>
	);
}
