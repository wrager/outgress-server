import Koa from 'koa';
import path from 'path';
import { Location } from './location';
import { OsmParser } from './osm-parser';
import { OutgressCore } from './core/outgress-core';
import { NumberUtil } from './util/number-util';
import { Type } from './util/type';
import { OsmXmlMapDataSource } from './core/app-data-source/osm-xml-map-data-source';
import { CoreOptions } from './core/core-options';
import { OverpassApiMapDataSource } from './core/app-data-source/overpass-api-map-data-source';

export class OutgressServer {
    private static readonly osmXmlDebugFilePath = path.resolve(
        process.cwd(),
        'data',
        'map.osm',
    );
    private static readonly port = 3000;

    private osmXmlMapDataCore: OutgressCore | undefined;
    private overpassMapDataCore: OutgressCore | undefined;

    private readonly app = new Koa();

    private static response(
        context: Koa.ParameterizedContext,
        type: string,
        body: string,
        status: number,
    ): void {
        context.type = type;
        context.body = body;
        context.status = status;
    }

    private static responseHtml(
        context: Koa.ParameterizedContext,
        html: string,
        status = 200,
    ): void {
        this.response(context, 'text/html', html, status);
    }

    private static responseJson(
        context: Koa.ParameterizedContext,
        data: object, // TODO: exclude Promise
        status = 200,
    ): void {
        this.response(
            context,
            'application/json',
            JSON.stringify(data),
            status,
        );
    }

    private static print(message: string): void {
        // eslint-disable-next-line no-console
        console.info(message);
    }

    public start(): void {
        this.initCore();
        this.initEndpoints();
        this.app.listen(OutgressServer.port);

        OutgressServer.print(
            `The server is started at http://localhost:${OutgressServer.port}.`,
        );
    }

    private async initCore(): Promise<void> {
        const options: CoreOptions = {
            db: {
                connectionString: 'sqlite:./data/database.db',
                logging: true,
            },
        };

        this.overpassMapDataCore = new OutgressCore(
            new OverpassApiMapDataSource(
                'https://overpass-api.de/api/interpreter',
            ),
            options,
        );
        await this.overpassMapDataCore.init();

        const osmXmlMapDataSource = new OsmXmlMapDataSource(
            OutgressServer.osmXmlDebugFilePath,
        );
        await osmXmlMapDataSource.init();
        this.osmXmlMapDataCore = new OutgressCore(osmXmlMapDataSource, options);
        await this.osmXmlMapDataCore.init();
    }

    private initEndpoints(): void {
        this.app.use(async (context) => {
            const { query } = context.request;

            if (context.request.path === '/parse-data') {
                const parser = new OsmParser(
                    OutgressServer.osmXmlDebugFilePath,
                );
                await parser.read();

                OutgressServer.responseJson(context, parser.getPortals());

                return;
            }

            if (context.request.path.startsWith('/core/')) {
                const core =
                    query['map-data-source'] === 'overpass-api'
                        ? this.overpassMapDataCore
                        : this.osmXmlMapDataCore;
                Type.assert(core);

                const tryParseCoordinateString = (
                    coordinateString: unknown,
                ): number => {
                    Type.assert(typeof coordinateString === 'string');

                    return NumberUtil.tryParseFloat(coordinateString);
                };

                const tryParseLocationString = (
                    locationString: unknown,
                ): Location => {
                    Type.assert(typeof locationString === 'string');

                    const coordinates = locationString
                        .split(',')
                        .map((coordinateString) =>
                            tryParseCoordinateString(coordinateString.trim()),
                        );
                    Type.assert(coordinates.length === 2);
                    return new Location(coordinates[0], coordinates[1]);
                };

                if (context.request.path === '/core/fill') {
                    Type.assert(typeof query.location === 'string');
                    Type.assert(typeof query.radius === 'string');

                    const location = tryParseLocationString(query.location);
                    const radius = NumberUtil.tryParseInteger(query.radius);

                    OutgressServer.responseJson(context, {
                        ok: true,
                        portalsAdded: await core.fillData(location, radius),
                    });

                    return;
                }

                if (context.request.path === '/core/user-map') {
                    const location = tryParseLocationString(query.location);

                    OutgressServer.responseJson(
                        context,
                        await core.getUserMap(location),
                    );

                    return;
                }
            }

            OutgressServer.responseHtml(
                context,
                `<h1>404</h1><p>not found</p>`,
                404,
            );
        });
    }
}
