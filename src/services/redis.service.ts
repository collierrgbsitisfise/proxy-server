import * as redis from 'redis';
import * as bluebird from 'bluebird';
bluebird.promisifyAll(redis);

class RedisClient {
    public host: string;
    private redisClient: any = null;

    constructor(host: string) {
        this.host = host;
    }
 
    public connect(): void {
        this.redisClient = redis.createClient(this.host);
    }

    public setValue(key: string, value:any): void {

        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }

        this.redisClient.set(key, value);
    }
    
    public setExpValue (key: string, value:any, seconds: number = 60 * 60 * 24): void {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }

        this.redisClient.set(key, value, 'EX', seconds);
    }
    
    public async getValue(key:string): Promise<any> {
        try {
            let result = await this.redisClient.getAsync(key);
            return {
                data: result,
                error: null
            }
        } catch (err) {
            return {
                data: null,
                error: err
            }
        }
    }
}

export default RedisClient;