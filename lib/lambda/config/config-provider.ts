/**
 * Provides configuration info to the AQI Notifier Lambda.
 */
export interface ConfigProvider {
  /**
   * Get the SID for the Twilio account.
   */
  getTwilioAccountSid(): string;

  /**
   * Get the Twilio phone number from which notifications will be sent.
   */
  getTwilioFromPhoneNumber(): string;

  /**
   * Get the phone number to which notifications will be sent.
   */
  getToPhoneNumber(): string;

  /**
   * Get the zip code used for air quality alerts.
   */
  getZipCode(): string;
}
