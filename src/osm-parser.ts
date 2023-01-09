import fs from 'fs';
import jsdom from 'jsdom';
import { Location } from './location';
import { Portal } from './portal';
import { MathUtil } from './util/math-util';
import { Type } from './util/type';

export class OsmParser {
    private static readonly locationPrecision: number = 7;

    private readonly encoding = 'utf8';
    private readonly filePath: string;
    private xml: jsdom.JSDOM | undefined;

    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    private get document(): Document {
        if (!this.xml) {
            throw new Error('XML document was not loaded.');
        }

        return this.xml.window.document;
    }

    private static tryParseNumber(
        string: string | null,
        parseFn: (string: string) => number,
    ): number {
        if (string === null) {
            throw new Error(`Could not parse number "${String(string)}".`);
        }

        return Type.assertNotNan(parseFn(string));
    }

    private static tryParseFloat(str: string | null): number {
        return OsmParser.tryParseNumber(str, parseFloat);
    }

    private static tryParseInt(string: string | null): number {
        return OsmParser.tryParseNumber(string, (str: string): number =>
            parseInt(str, 10),
        );
    }

    public async read(): Promise<void> {
        const dataFileContents = await fs.promises.readFile(
            this.filePath,
            this.encoding,
        );
        this.xml = new jsdom.JSDOM(dataFileContents, {
            contentType: 'application/xml',
        });
    }

    public getPortals(): readonly Portal[] {
        return this.querySelectorAll('way > tag[k="historic"]').map((tag) => {
            const location = this.getWayNodeLocation(
                Type.assertDefined(tag.parentElement),
            );

            if (location === undefined) {
                throw new Error(
                    `Unknown location of way "${String(
                        tag.parentElement?.getAttribute('id'),
                    )}".`,
                );
            }

            return new Portal(
                location,
                this.querySelector(
                    'tag[k="name"]',
                    Type.assertDefined(tag.parentElement),
                ).getAttribute('v') ?? '',
                tag.getAttribute('v') ?? '',
            );
        });
    }

    private getRefLocation(id: number): Location {
        const node = this.querySelector(`node[id="${id}"]`);

        return new Location(
            OsmParser.tryParseFloat(node.getAttribute('lat')),
            OsmParser.tryParseFloat(node.getAttribute('lon')),
        );
    }

    private getWayNodeLocation(node: ParentNode): Location | undefined {
        const ndNodes = this.querySelectorAll('nd', node);
        const locations = ndNodes.map((ndNode) =>
            this.getRefLocation(
                OsmParser.tryParseInt(ndNode.getAttribute('ref')),
            ),
        );

        if (locations.length === 0) {
            throw new Error(`Unknown location of node ${String(node)}.`);
        }

        const latitudes = locations.map((location) => location.latitude);
        const centerLatitude = MathUtil.round(
            MathUtil.average([
                Math.min(...latitudes),
                Math.max(...latitudes),
            ]) ?? 0,
            OsmParser.locationPrecision,
        );

        const longitudes = locations.map((location) => location.longitude);
        const centerLongitude = MathUtil.round(
            MathUtil.average([
                Math.min(...longitudes),
                Math.max(...longitudes),
            ]) ?? 0,
            OsmParser.locationPrecision,
        );

        return new Location(centerLatitude, centerLongitude);
    }

    private querySelector(
        selector: string,
        element: ParentNode = this.document,
    ): Element {
        const node = element.querySelector(selector);

        if (node === null) {
            throw new Error(`Could not find node "${selector}".`);
        }

        return node;
    }

    private querySelectorAll(
        selector: string,
        element: ParentNode = this.document,
    ): readonly Element[] {
        return [...element.querySelectorAll(selector)];
    }
}
