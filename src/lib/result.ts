export type Ok<T> = {
  readonly ok: true;
  value: T;
};
export type Error<E> = { readonly ok: false; error: E };
export type Result<T, E> = Ok<T> | Error<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const error = <E>(error: E): Error<E> => ({ ok: false, error });
