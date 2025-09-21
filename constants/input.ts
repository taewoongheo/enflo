const INPUT_VALIDATION = {
  SESSION_NAME: {
    MAX_LENGTH: 20,
    MIN_LENGTH: 1,
  },
} as const;

export const isValidSessionName = (
  name: string,
  t: (
    key: string,
    options?: { minLength: number; maxLength: number },
  ) => string,
): { isValid: boolean; errorMessage?: string } => {
  if (name.length < INPUT_VALIDATION.SESSION_NAME.MIN_LENGTH) {
    return {
      isValid: false,
      errorMessage: t('sessionNameMinLengthError', {
        minLength: INPUT_VALIDATION.SESSION_NAME.MIN_LENGTH,
        maxLength: INPUT_VALIDATION.SESSION_NAME.MAX_LENGTH,
      }),
    };
  }
  if (name.length > INPUT_VALIDATION.SESSION_NAME.MAX_LENGTH) {
    return {
      isValid: false,
      errorMessage: t('sessionNameMaxLengthError', {
        minLength: INPUT_VALIDATION.SESSION_NAME.MIN_LENGTH,
        maxLength: INPUT_VALIDATION.SESSION_NAME.MAX_LENGTH,
      }),
    };
  }

  return { isValid: true };
};
