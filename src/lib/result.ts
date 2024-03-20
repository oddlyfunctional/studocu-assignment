export type Ok<T> = {
  readonly ok: true;
  value: T;
};
export type Error<E> = { readonly ok: false; error: E };
export type Result<T, E> = Ok<T> | Error<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const error = <E>(error: E): Error<E> => ({ ok: false, error });

export const flatMap = <A, B, E>(
  result: Result<A, E>,
  f: (value: A) => Result<B, E>
): Result<B, E> => {
  if (result.ok) return f(result.value);
  return result;
};

export const map = <A, B, E>(
  result: Result<A, E>,
  f: (value: A) => B
): Result<B, E> => flatMap(result, (value) => ok(f(value)));

export const zip = <A, B, E>(
  r1: Result<A, E>,
  r2: Result<B, E>
): Result<[A, B], E> => flatMap(r1, (v1) => map(r2, (v2) => [v1, v2]));
