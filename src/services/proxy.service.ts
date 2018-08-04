import Proxy from './../models/proxy.model';

class ProxyService {
    
    constructor() {}
    
    private async getProxyList(): Promise<any> {
        try {
            const allProxies = await Proxy.find({}).exec();
            return {
                data: allProxies,
                error: null
            }
        } catch(err) {
            return {
                data: err,
                error: true
            } 
        }
    }
}

export default ProxyService