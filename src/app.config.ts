export interface IConnectionPaths {
    httpBaseUrl: string;
    ampqQueueName: string;
}
export interface IServiceConnections {
    gateway: IConnectionPaths;
    user: IConnectionPaths;
    product: IConnectionPaths;
    order: IConnectionPaths;
    payment: IConnectionPaths;

}

export const ServiceConnections: IServiceConnections = {
    gateway: {
        httpBaseUrl: `http://localhost:3000`,
        ampqQueueName: `gradell_api`
    },
    user: {
        httpBaseUrl: `http://localhost:3001`,
        ampqQueueName: `gradell_user`
    },
    product: {
        httpBaseUrl: `http://localhost:3002`,
        ampqQueueName: `gradell_product`
    },
    order: {
        httpBaseUrl: `http://localhost:3003`,
        ampqQueueName: `gradell_order`
    },
    payment: {
        httpBaseUrl: `http://localhost:3004`,
        ampqQueueName: `gradell_payment`
    },
}