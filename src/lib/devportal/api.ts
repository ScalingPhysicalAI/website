import { PUBLIC_DEV_API_URL } from '$env/static/public';

const BASE = PUBLIC_DEV_API_URL;

export function isAuthenticated(): boolean {
	if (typeof localStorage === 'undefined') return false;
	return !!localStorage.getItem('dev_access_token');
}

function getToken(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('dev_access_token');
}

async function apiRequest(path: string, options: RequestInit = {}): Promise<Response> {
	const token = getToken();
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) ?? {})
	};
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return fetch(`${BASE}${path}`, { ...options, headers });
}

export async function login(email: string, password: string): Promise<void> {
	const res = await apiRequest('/api/v1/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? 'Login failed');
	localStorage.setItem('dev_access_token', data.access_token);
	if (data.refresh_token) localStorage.setItem('dev_refresh_token', data.refresh_token);
}

export async function register(
	name: string,
	email: string,
	org_name: string,
	password: string
): Promise<void> {
	const res = await apiRequest('/api/v1/auth/register', {
		method: 'POST',
		body: JSON.stringify({ name, email, org_name, password, tos_accepted: true })
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? 'Registration failed');
}

export function logout(): void {
	localStorage.removeItem('dev_access_token');
	localStorage.removeItem('dev_refresh_token');
}

export type Certificate = {
	id: number;
	serial_number: string;
	issued_at: string;
	expires_at: string;
	is_revoked: boolean;
	revocation_reason: string | null;
};

export async function listCertificates(): Promise<Certificate[]> {
	const res = await apiRequest('/api/v1/developers/keys');
	if (res.status === 401) {
		logout();
		throw new Error('SESSION_EXPIRED');
	}
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? 'Failed to load certificates');
	return data;
}

export type KeySubmitResult = {
	certificate_id: number;
	serial_number: string;
	certificate_pem: string;
	ca_certificate_pem: string;
	issued_at: string;
	expires_at: string;
};

export async function submitKey(
	public_key: string,
	key_source: 'generated' | 'uploaded'
): Promise<KeySubmitResult> {
	const res = await apiRequest('/api/v1/developers/keys', {
		method: 'POST',
		body: JSON.stringify({ public_key, key_source })
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? 'Failed to submit key');
	return data;
}

export async function revokeKey(cert_id: number): Promise<void> {
	const res = await apiRequest(`/api/v1/developers/keys/${cert_id}`, {
		method: 'DELETE'
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? 'Failed to revoke certificate');
}

export type CACertInfo = {
	certificate_pem: string;
	fingerprint_sha256: string;
};

export async function getCACertificate(): Promise<CACertInfo> {
	const res = await apiRequest('/api/v1/ca/certificate');
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? 'Failed to fetch CA certificate');
	return data;
}
