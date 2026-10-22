import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import {
	AGREEMENT_COVER,
	AGREEMENT_SIGNATURE_BLOCKS,
	LOI_SIGNATURE_BLOCK,
	type Box,
	type SignatureBlock
} from './fields';
import { AGREEMENT_PDF_BASE64 } from './templates/agreement.b64';
import { LOI_PDF_BASE64 } from './templates/loi.b64';

export type PartnerSubmission = {
	companyName: string;
	signerName: string;
	signerTitle: string;
	/** `data:image/png;base64,...` from the signature canvas. */
	signatureDataUrl: string;
	dateLabel: string;
};

const FONT_SIZE = 10;
const MIN_FONT_SIZE = 6;
// The standard PDF fonts only support WinAnsi encoding (printable ASCII plus
// Latin-1 supplement); anything outside that would crash drawText.
const WIN_ANSI_SAFE = /[^\u0020-\u00ff]/g;

function fitFontSize(font: PDFFont, text: string, maxWidth: number) {
	let size = FONT_SIZE;
	while (size > MIN_FONT_SIZE && font.widthOfTextAtSize(text, size) > maxWidth) {
		size -= 0.5;
	}
	return size;
}

function toWinAnsiSafe(text: string) {
	return text.replace(WIN_ANSI_SAFE, '');
}

function drawField(page: PDFPage, font: PDFFont, box: Box, value: string, whiteout = false) {
	const text = toWinAnsiSafe(value).trim();
	if (!text) return;
	if (whiteout) {
		// Covers the template's bracketed placeholder text before writing over it.
		page.drawRectangle({
			x: box.x - 2,
			y: box.y - 4,
			width: box.width + 4,
			height: 14,
			color: rgb(1, 1, 1)
		});
	}
	const size = fitFontSize(font, text, box.width);
	page.drawText(text, { x: box.x, y: box.y, size, font, color: rgb(0.06, 0.06, 0.05) });
}

async function drawSignature(pdfDoc: PDFDocument, page: PDFPage, box: Box, signatureDataUrl: string) {
	const base64 = signatureDataUrl.split(',')[1];
	if (!base64) return;
	const bytes = Buffer.from(base64, 'base64');
	const image = signatureDataUrl.startsWith('data:image/jpeg')
		? await pdfDoc.embedJpg(bytes)
		: await pdfDoc.embedPng(bytes);
	const maxHeight = 24;
	const scale = Math.min(box.width / image.width, maxHeight / image.height, 1);
	page.drawImage(image, {
		x: box.x,
		y: box.y - 2,
		width: image.width * scale,
		height: image.height * scale
	});
}

async function fillSignatureBlock(
	pdfDoc: PDFDocument,
	font: PDFFont,
	pages: PDFPage[],
	block: SignatureBlock,
	data: PartnerSubmission
) {
	const page = pages[block.page];
	if (block.legalNameHeader) {
		drawField(page, font, block.legalNameHeader, data.companyName, true);
	}
	drawField(page, font, block.name, data.signerName);
	drawField(page, font, block.title, data.signerTitle);
	drawField(page, font, block.date, data.dateLabel);
	await drawSignature(pdfDoc, page, block.signature, data.signatureDataUrl);
}

/**
 * Fills the partner's identity and signature into both legal templates.
 * StarForge's own signature blocks are left blank for manual countersigning.
 */
export async function fillPartnerDocuments(data: PartnerSubmission) {
	const agreementBytes = Buffer.from(AGREEMENT_PDF_BASE64, 'base64');
	const loiBytes = Buffer.from(LOI_PDF_BASE64, 'base64');

	const agreementDoc = await PDFDocument.load(agreementBytes);
	const loiDoc = await PDFDocument.load(loiBytes);

	const agreementFont = await agreementDoc.embedFont(StandardFonts.Helvetica);
	const loiFont = await loiDoc.embedFont(StandardFonts.Helvetica);

	const agreementPages = agreementDoc.getPages();
	const loiPages = loiDoc.getPages();

	drawField(
		agreementPages[AGREEMENT_COVER.page],
		agreementFont,
		AGREEMENT_COVER.partnerLegalName,
		data.companyName,
		true
	);
	drawField(
		agreementPages[AGREEMENT_COVER.page],
		agreementFont,
		AGREEMENT_COVER.effectiveDate,
		data.dateLabel,
		true
	);

	for (const block of AGREEMENT_SIGNATURE_BLOCKS) {
		await fillSignatureBlock(agreementDoc, agreementFont, agreementPages, block, data);
	}
	await fillSignatureBlock(loiDoc, loiFont, loiPages, LOI_SIGNATURE_BLOCK, data);

	const [agreement, loi] = await Promise.all([agreementDoc.save(), loiDoc.save()]);
	return { agreement, loi };
}
