import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fillPartnerDocuments } from '$lib/server/partner-agreement/fill';
import { sendPartnerPackage } from '$lib/server/partner-agreement/mailer';

export const prerender = false;
export const config = { runtime: 'edge' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;
// Signature canvases are small line-art PNGs; this is generous headroom.
const MAX_SIGNATURE_BYTES = 1_500_000;

function readField(value: unknown, label: string) {
	if (typeof value !== 'string') throw new Error(`${label} is required.`);
	const trimmed = value.trim();
	if (!trimmed) throw new Error(`${label} is required.`);
	if (trimmed.length > MAX_FIELD_LENGTH) throw new Error(`${label} is too long.`);
	return trimmed;
}

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	const data = body as Record<string, unknown>;

	let companyName: string, signerName: string, signerTitle: string, signerEmail: string;
	try {
		companyName = readField(data.companyName, 'Company name');
		signerName = readField(data.signerName, 'Your name');
		signerTitle = readField(data.signerTitle, 'Your title');
		signerEmail = readField(data.email, 'Email');
	} catch (err) {
		return json({ error: (err as Error).message }, { status: 400 });
	}

	if (!EMAIL_RE.test(signerEmail)) {
		return json({ error: 'Enter a valid email address.' }, { status: 400 });
	}

	const signatureDataUrl = data.signatureDataUrl;
	if (
		typeof signatureDataUrl !== 'string' ||
		!/^data:image\/(png|jpeg);base64,/.test(signatureDataUrl)
	) {
		return json({ error: 'A signature is required.' }, { status: 400 });
	}
	if (signatureDataUrl.length > MAX_SIGNATURE_BYTES) {
		return json({ error: 'Signature image is too large.' }, { status: 400 });
	}

	const dateLabel = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	try {
		const { agreement, loi } = await fillPartnerDocuments({
			companyName,
			signerName,
			signerTitle,
			signatureDataUrl,
			dateLabel
		});

		await sendPartnerPackage({
			companyName,
			signerName,
			signerEmail,
			agreementPdf: agreement,
			loiPdf: loi
		});
	} catch (err) {
		console.error('partner-agreement submission failed', err);
		return json(
			{ error: 'Something went wrong sending your agreement. Please try again.' },
			{ status: 500 }
		);
	}

	return json({ ok: true });
};
