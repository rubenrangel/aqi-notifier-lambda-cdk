/**
 * Provide secrets to the AQI Notifier Lambda.
 */
export interface SecretsProvider {
  /**
   * Get the auth token for the Twilio account.
   */
  getTwilioAuthToken(): Promise<string>;

  /**
   * Get the API key for the AirNow API.
   */
  getAirNowApiKey(): Promise<string>;
}
