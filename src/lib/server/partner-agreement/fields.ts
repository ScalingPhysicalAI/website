// Coordinates below were measured from `pdftotext -bbox-layout` against the
// original templates (Letter page, 612x792pt). They are fixed to the exact
// line/placeholder each template already reserves for the partner, so a
// template edit that reflows text will require re-measuring these.
//
// `pdftotext` reports y measured from the TOP of the page; pdf-lib's origin
// is bottom-left, so every y here has already been converted with
// `pdfY = 792 - yMaxFromPdftotext` to land on the text baseline.

export type Box = { x: number; y: number; width: number };

export type SignatureBlock = {
	/** 0-indexed page in pdf-lib terms. */
	page: number;
	/** Overlays the static "[PARTNER LEGAL NAME]" header, if this block has one. */
	legalNameHeader?: Box;
	name: Box;
	title: Box;
	signature: Box;
	date: Box;
};

export const AGREEMENT_COVER = {
	page: 0,
	partnerLegalName: { x: 276, y: 576.14, width: 250 } satisfies Box,
	effectiveDate: { x: 306, y: 558.74, width: 190 } satisfies Box
};

export const AGREEMENT_SIGNATURE_BLOCKS: SignatureBlock[] = [
	{
		// "34. Signatures"
		page: 7,
		legalNameHeader: { x: 311.5, y: 605.55, width: 220 },
		name: { x: 342, y: 591.25, width: 158 },
		title: { x: 335, y: 576.95, width: 163 },
		signature: { x: 357, y: 562.65, width: 143 },
		date: { x: 337, y: 548.35, width: 163 }
	},
	{
		// "SOW Signatures"
		page: 8,
		legalNameHeader: { x: 311.5, y: 262.9, width: 220 },
		name: { x: 342, y: 245.6, width: 158 },
		title: { x: 335, y: 228.3, width: 163 },
		signature: { x: 357, y: 211.0, width: 143 },
		date: { x: 337, y: 193.7, width: 163 }
	}
];

export const LOI_SIGNATURE_BLOCK: SignatureBlock = {
	page: 6,
	// LOI's "Deployment Partner" column has a "Legal Name:" line above
	// Name/Title/Signature/Date rather than a bracketed header to overlay.
	legalNameHeader: { x: 311.5, y: 609.38, width: 195 },
	name: { x: 345, y: 584.98, width: 175 },
	title: { x: 337, y: 560.58, width: 175 },
	signature: { x: 362, y: 536.18, width: 175 },
	date: { x: 340, y: 511.78, width: 175 }
};
