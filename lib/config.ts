import {Parameter, SSM} from "@aws-sdk/client-ssm";

export interface IConfig {
    getTwilioAccountSid(): string;
    getTwilioFromPhoneNumber(): string;
    getToPhoneNumber(): string;
    getZipCode(): string;
}

export class AwsSsmConfig implements IConfig {
    params: Parameter[]

    constructor() {
        if (this.params !== undefined) {
            return;
        }

        const ssm = new SSM({});
        ssm.getParameters({
            Names: [
                process.env.TWILIO_ACCOUNT_SID_PARAM_KEY as string,
                process.env.TWILIO_FROM_PHONE_NUMBER_PARAM_KEY as string,
                process.env.TO_PHONE_NUMBER_PARAM_KEY as string
            ]
        })
            .then((resp) => {
                this.params = resp.Parameters as Parameter[];
            });
    }

    getParam(paramKey: string): string | undefined {
        const find = this.params.filter(param => param.Name === paramKey);

        return find.length == 0 ? undefined : find[0].Value;
    }

    getToPhoneNumber(): string {
        return this.getParam(process.env.TO_PHONE_NUMBER_PARAM_KEY as string) as string;
    }

    getTwilioAccountSid(): string {
        return this.getParam(process.env.TWILIO_ACCOUNT_SID_PARAM_KEY as string) as string;
    }

    getTwilioFromPhoneNumber(): string {
        return this.getParam(process.env.TWILIO_FROM_PHONE_NUMBER_PARAM_KEY as string) as string;
    }

    getZipCode(): string {
        return this.getParam(process.env.ZIP_CODE_PARAM_KEY as string) as string;
    }
}

export class EnvConfig implements IConfig {
    getToPhoneNumber(): string {
        return process.env.TO_PHONE_NUMBER as string;
    }

    getTwilioAccountSid(): string {
        return process.env.TWILIO_ACCOUNT_SID as string;
    }

    getTwilioFromPhoneNumber(): string {
        return process.env.TWILIO_FROM_PHONE_NUMBER as string;
    }

    getZipCode(): string {
        return process.env.ZIP_CODE as string;
    }
}
