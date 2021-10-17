import axios from 'axios';
import { AirNow } from '../../../lib/lambda/airnow';

jest.mock('axios');

describe('AirNow', () => {
  describe('getAqiForZipcode', () => {
    it('should return the AQI for a zip code', async () => {
      const mockFunction = jest.fn().mockReturnValue({
        data: [
          {
            DateObserved: '2021-10-05 ',
            HourObserved: 16,
            LocalTimeZone: 'PST',
            ReportingArea: 'Portland',
            StateCode: 'OR',
            Latitude: 45.538,
            Longitude: -122.656,
            ParameterName: 'O3',
            AQI: 19,
            Category: {
              Number: 1,
              Name: 'Good',
            },
          },
        ],
      });

      axios.get = mockFunction;

      const client = new AirNow('some-api-key');
      await expect(client.getAqiForZipcode('97103')).resolves.toBe(19);
      expect(mockFunction).toHaveBeenCalledWith('https://www.airnowapi.org/aq/observation/zipCode/current', {
        params: {
          zipCode: '97103',
          format: 'JSON',
          API_KEY: 'some-api-key',
        },
      });
    });

    it('should return a rejection if no measurements are found', async () => {
      axios.get = jest.fn().mockReturnValue({
        data: [],
      });

      const client = new AirNow('some-api-key');
      await expect(client.getAqiForZipcode('97103')).rejects.toEqual(
        new Error('No measurements found for zip code: 97103')
      );
    });
  });
});
