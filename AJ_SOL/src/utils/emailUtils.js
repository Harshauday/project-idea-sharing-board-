/**
 * Generates a unique email by appending a timestamp to the local part of the email
 * @param {string} email - The original email input
 * @returns {string} - A unique email with timestamp
 */
export const generateUniqueEmail = (email) => {
  // Check if the email contains an '@' symbol
  if (email.includes('@')) {
    // Split the email at '@', add timestamp after username, keep domain
    const [localPart, domain] = email.split('@');
    return `${localPart}_${Date.now()}@${domain}`;
  } else {
    // If no '@' symbol, append timestamp and add default domain
    return `${email}_${Date.now()}@example.com`;
  }
};