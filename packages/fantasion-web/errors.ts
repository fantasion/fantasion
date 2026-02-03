const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_FORBIDDEN = 403;
const HTTP_STATUS_NOT_FOUND = 404;

export class ServerError extends Error {
	public body: unknown;
}

export class BadRequest extends ServerError {}
export class Forbidden extends ServerError {}
export class NotFound extends ServerError {}
export class Unauthorized extends ServerError {}
export class InternalServerError extends ServerError {}

export function resolveApiErrorClass(res: Response): typeof ServerError {
	if (res.status === HTTP_STATUS_UNAUTHORIZED) {
		return Unauthorized;
	}
	if (res.status === HTTP_STATUS_FORBIDDEN) {
		return Forbidden;
	}
	if (res.status === HTTP_STATUS_NOT_FOUND) {
		return NotFound;
	}
	if (res.status === HTTP_STATUS_BAD_REQUEST) {
		return BadRequest;
	}
	return InternalServerError;
}
