import fs from 'fs';
import jsdom from 'jsdom';
import { Location } from 'outgress-lib/model/geo/location';
import { Way } from 'outgress-lib/model/geo/way';
import { PortalType } from 'outgress-lib/model/portal-type/portal-type';
import { Portal } from 'outgress-lib/model/portal/portal';
import { NumberUtil } from 'outgress-lib/util/number-util';
import { StringUtil } from 'outgress-lib/util/string-util';
import { Type } from 'outgress-lib/util/type';

export class OsmParser {
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
            const way = this.getWayFromNode(Type.defined(tag.parentElement));

            return new Portal(
                way.center,
                this.querySelector(
                    'tag[k="name"]',
                    Type.defined(tag.parentElement),
                ).getAttribute('v') ?? '',
                new PortalType(
                    StringUtil.capitalize(Type.defined(tag.getAttribute('v'))),
                    Type.defined(tag.getAttribute('v')),
                ),
            );
        });
    }

    private getRefLocation(id: number): Location {
        const node = this.querySelector(`node[id="${id}"]`);

        return new Location(
            NumberUtil.tryParseFloat(node.getAttribute('lat')),
            NumberUtil.tryParseFloat(node.getAttribute('lon')),
        );
    }

    private getWayFromNode(node: ParentNode): Way {
        const ndNodes = this.querySelectorAll('nd', node);
        const locations = ndNodes.map((ndNode) =>
            this.getRefLocation(
                NumberUtil.tryParseInteger(ndNode.getAttribute('ref')),
            ),
        );
        if (locations.length === 0) {
            throw new Error(`Unknown location of node ${String(node)}.`);
        }

        return new Way(locations);
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
