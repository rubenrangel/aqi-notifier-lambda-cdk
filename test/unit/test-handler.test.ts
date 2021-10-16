'use strict';

import { Context, ScheduledEvent } from 'aws-lambda';
import {handler} from "../../lib/index.handler";

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const event: ScheduledEvent<string> = {
            id: 'string',
            version: 'string',
            account: 'string',
            time: 'string',
            region: 'string',
            resources: [],
            source: 'string',
            'detail-type': 'Scheduled Event',
            detail: 'some detail',
        };
        const context = {} as jest.Mocked<Context>;
        const callback = jest.fn();
        await handler(event, context, callback)
    });
});
