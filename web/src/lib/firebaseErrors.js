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
    case 'functions/failed-precondition':
      return error.message || 'This action violates a business rule.';
    case 'functions/invalid-argument':
      return 'The submitted data is invalid. Please review the form.';
    case 'functions/unavailable':
    case 'unavailable':
      return 'Cloud Functions is unavailable. Deploy the functions to this Firebase project or start the emulator.';
    case 'functions/internal':
      return 'The backend did not answer as a valid callable function. Confirm that createProduct is deployed in the same Firebase project and region.';
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    default:
      if (
        error?.message?.includes('CORS') ||
        error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('preflight')
      ) {
        return 'The browser could not reach Firebase Functions. Confirm that the function is deployed in this project and that the region matches the frontend configuration.';
      }

      return error?.message || 'Something went wrong. Please try again.';
  }
}
