export const ErrorCode = {
  UpdateFailed: 'UPDATE_FAILED',
  NotFound:     'NOT_FOUND',
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

const USER_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UpdateFailed]: 'Status update failed — changes reverted. Please try again.',
  [ErrorCode.NotFound]:     'The requested order could not be found.',
};

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return USER_MESSAGES[error.code];
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}
