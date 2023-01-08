import fs from 'fs';
import jsdom from 'jsdom';
import { Coordinates } from './coordinates';
import { Portal } from './portal';

export class OsmParser {
    private readonly encoding = 'utf8';
    private readonly filePath: string;
    private xml: jsdom.JSDOM | undefined;

    public constructor(filePath: string) {
        this.filePath = filePath;
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
        if (!this.xml) {
            return [];
        }

        const historicWayTags = this.xml.window.document.querySelectorAll(
            'way > tag[k="historic"]',
        );

        return [...historicWayTags].map(
            (tag) =>
                new Portal(
                    new Coordinates(1, 2),
                    tag.parentElement
                        ?.querySelector('tag[k="name"]')
                        ?.getAttribute('v') ?? '',
                    tag.getAttribute('v') ?? '',
                ),
        );
    }
}
