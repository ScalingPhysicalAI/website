import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

export type PartnerPackage = {
	companyName: string;
	signerName: string;
	signerEmail: string;
	agreementPdf: Uint8Array;
	loiPdf: Uint8Array;
};

export async function sendPartnerPackage(pkg: PartnerPackage) {
	const { RESEND_API_KEY, RESEND_FROM, PARTNER_NOTIFY_EMAIL } = env;
	if (!RESEND_API_KEY) {
		throw new Error('RESEND_API_KEY is not configured.');
	}
	if (!PARTNER_NOTIFY_EMAIL) {
		throw new Error('PARTNER_NOTIFY_EMAIL is not configured.');
	}

	const resend = new Resend(RESEND_API_KEY);
	const { error } = await resend.emails.send({
		from: RESEND_FROM || 'Buildo Creators <onboarding@resend.dev>',
		to: PARTNER_NOTIFY_EMAIL,
		replyTo: pkg.signerEmail,
		subject: `Buildo Creators partner signed: ${pkg.companyName}`,
		text: [
			`${pkg.signerName} (${pkg.signerEmail}) signed the partner agreement and LOI on behalf of ${pkg.companyName}.`,
			'',
			"Both PDFs are attached with StarForge's signature blocks left blank for countersigning."
		].join('\n'),
		attachments: [
			{
				filename: 'StarForge-Revenue-Sharing-Agreement-signed.pdf',
				content: Buffer.from(pkg.agreementPdf).toString('base64')
			},
			{
				filename: 'StarForge-Deployment-Partner-LOI-signed.pdf',
				content: Buffer.from(pkg.loiPdf).toString('base64')
			}
		]
	});

	if (error) {
		throw new Error(error.message);
	}
}
