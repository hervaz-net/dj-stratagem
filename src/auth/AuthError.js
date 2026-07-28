/** Thrown for any non-2xx auth response; carries the server's error code. */
export default class AuthError extends Error {
  constructor(message, { code, fields, status } = {}) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.fields = fields ?? null;
    this.status = status;
  }
}
