import axios from 'axios';

const BASE_URL = 'https://www.airnowapi.org';

type Observation = {
    AQI: string
}

export class AirNow {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async getAqiForZipcode(zipcode: string): Promise<number> {
        const data = await axios.get<Observation[]>(`${BASE_URL}/aq/observation/zipCode/current`, {
            params: {
                format: 'JSON',
                zipCode: zipcode,
                API_KEY: this.apiKey
            }
        });

        return Number.parseFloat(data.data[0].AQI);
    }
}
