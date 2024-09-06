export const isStatusOk = (status: number) => status >= 200 && status < 300;


export function handleError(error: unknown, message: string) {
  console.error(message, error);
  return { error: message };
}
