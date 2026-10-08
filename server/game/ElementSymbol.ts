import { Element } from './Constants.js';
import { EffectSource } from './EffectSource.js';
import type BaseCard from './BaseCard.js';
import type Game from './Game.js';

export type ElementSymbolInfo = {
    element: Element;
    key: string;
    prettyName: string;
};

export class ElementSymbol extends EffectSource {
    printedType = 'elementSymbol';
    element: Element;
    key: string;
    prettyName: string;

    constructor(game: Game, public card: BaseCard, info: ElementSymbolInfo) {
        super(game, `${info.prettyName} (${info.element})`);
        this.element = info.element;
        this.key = info.key;
        this.prettyName = info.prettyName;
    }
}

