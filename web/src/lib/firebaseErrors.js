export function getErrorMessage(error) {
  const code = error?.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already associated with an account.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Your email or password is incorrect.';
    case 'auth/weak-password':
      return 'Use a stronger password with at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error while contacting Firebase. Check your connection and project configuration.';
    case 'failed-precondition':
      return error.message || 'This action violates a business rule.';
    case 'invalid-argument':
      return 'The submitted data is invalid. Please review the form.';
    case 'not-found':
      return error.message || 'The requested record was not found.';
    case 'unauthenticated':
      return 'You must be signed in to perform this action.';
    case 'unavailable':
    case 'aborted':
      return 'This record changed while the action was running. Please try again.';
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    default:
      if (error?.message?.includes('Failed to fetch')) {
        return 'The browser could not reach Firebase. Confirm your connection and project configuration.';
      }

      return error?.message || 'Something went wrong. Please try again.';
  }
}
