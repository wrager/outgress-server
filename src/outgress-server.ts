import Koa from 'koa';
import { Db } from './db/db';

export class OutgressServer {
    private static readonly port = 3000;

    private readonly app = new Koa();

    private readonly db = new Db();

    private static print(message: string): void {
        // eslint-disable-next-line no-console
        console.info(message);
    }

    public start(): void {
        this.initEndpoints();
        this.app.listen(OutgressServer.port);

        OutgressServer.print(
            `The server is started at port ${OutgressServer.port}.`,
        );
    }

    private initEndpoints(): void {
        this.app.use((context) => {
            context.body = 'Hello Koa';
        });
    }
}
