import path from 'path';
import Koa from 'koa';
import { Db } from './db';
import { OsmParser } from './osm-parser';

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
            `The server is started at http://localhost:${OutgressServer.port}.`,
        );
    }

    private initEndpoints(): void {
        this.app.use(async (context) => {
            if (context.request.path === '/parse-data') {
                const parser = new OsmParser(
                    path.resolve(process.cwd(), 'data', 'map.osm'),
                );
                await parser.read();
                context.type = 'application/json';
                context.body = JSON.stringify(parser.getPortals());
            } else {
                context.body = '<h1>404</h1><h2>not found</h2>';
                context.status = 404;
            }
        });
    }
}
