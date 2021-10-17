import axios from 'axios';

const BASE_URL = 'https://www.airnowapi.org';

type Observation = {
  /**
   * Date of observation.
   * @example '2012-02-01'
   */
  DateObserved: string;

  /**
   * Hour of observation (00-23).
   */
  HourObserved: number;

  /**
   * Time zone of observed data value.
   * @example 'PST'
   */
  LocalTimeZone: string;

  /**
   * City or area name of observed data (data values are peak of monitoring sites associated with this area).
   */
  ReportingArea: string;

  /**
   * Two-character state abbreviation.
   */
  StateCode: string;

  /**
   * Latitude in decimal degrees.
   */
  Latitude: number;

  /**
   * Longitude in decimal degrees.
   */
  Longitude: number;

  /**
   * Name of parameter.
   */
  ParameterName: string;

  /**
   * Observed AQI value (peak value of monitoring sites associated with a reporting area).
   */
  AQI: number;

  Category: {
    /**
     * Observed AQI category number:
     * Good
     * Moderate
     * Unhealthy for Sensitive Groups
     * Unhealthy
     * Very Unhealthy
     * Hazardous
     * Unavailable
     */
    Number: number;

    /**
     * Observed AQI category name:
     * Good
     * Moderate
     * Unhealthy for Sensitive Groups
     * Unhealthy
     * Very Unhealthy
     * Hazardous
     * Unavailable
     */
    Name: string;
  };
};

/**
 * AirNow API client.
 */
export class AirNow {
  constructor(private readonly apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Retrieve the latest AQI info for the given zipcode.
   * @param {string} zipcode
   *
   * @see https://docs.airnowapi.org/CurrentObservationsByZip/docs
   */
  async getAqiForZipcode(zipcode: string): Promise<number> {
    const data = await axios.get<Observation[]>(`${BASE_URL}/aq/observation/zipCode/current`, {
      params: {
        format: 'JSON',
        zipCode: zipcode,
        API_KEY: this.apiKey,
      },
    });

    return data.data[0].AQI;
  }
}
