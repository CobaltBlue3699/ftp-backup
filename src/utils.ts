export function assertNonNullable<T>(
	name: string,
	value: T | null | undefined,
): asserts value is NonNullable<T> {
	if (value === null || value === undefined) {
		const message = `Variable "${name}" cannot be "${String(value)}".`;
		throw new Error(message);
	}
}

export function isString(name: string, value: any): asserts value is string {
	if (typeof value !== 'string') {
		const message = `Variable "${name}" is not a "string".`;
		throw new Error(message);
	}
}

export function isNumber(name: string, value: any): asserts value is number {
	if (typeof value !== 'string') {
		const message = `Variable "${name}" is not a "number".`;
		throw new Error(message);
	}
}

export function extractStringEnvVar(key: keyof NodeJS.ProcessEnv): string {
	const value = process.env[key];

	if (value === undefined) {
		const message = `The environment variable "${key}" cannot be "undefined".`;
		throw new Error(message);
	}

	return value;
}
