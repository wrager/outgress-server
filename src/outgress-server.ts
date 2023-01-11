import Koa from 'koa';
import path from 'path';
import { Location } from './location';
import { OsmXmlMapData } from './map-data/osm-xml-map-data';
import { OverpassMapData } from './map-data/overpass-map-data';
import { OsmParser } from './osm-parser';
import { OutgressCore } from './outgress-core';
import { NumberUtil } from './util/number-util';
import { Type } from './util/type';

export class OutgressServer {
    private static readonly osmXmlFilePath = path.resolve(
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
        const osmXmlMapData = new OsmXmlMapData(OutgressServer.osmXmlFilePath);
        await osmXmlMapData.init();
        this.osmXmlMapDataCore = new OutgressCore(osmXmlMapData);

        this.overpassMapDataCore = new OutgressCore(new OverpassMapData());
    }

    private initEndpoints(): void {
        this.app.use(async (context) => {
            if (context.request.path === '/parse-data') {
                const parser = new OsmParser(OutgressServer.osmXmlFilePath);
                await parser.read();

                OutgressServer.responseJson(context, parser.getPortals());

                return;
            }

            if (context.request.path.startsWith('/core/')) {
                const core =
                    context.request.query['data-source'] === 'overpass'
                        ? this.overpassMapDataCore
                        : this.osmXmlMapDataCore;
                Type.assert(core);

                if (context.request.path === '/core/user-map') {
                    const latitude = NumberUtil.tryParseFloat(
                        String(context.request.query.latitude),
                    );
                    const longitude = NumberUtil.tryParseFloat(
                        String(context.request.query.longitude),
                    );

                    OutgressServer.responseJson(
                        context,
                        await core.getUserMap(
                            new Location(latitude, longitude),
                        ),
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
