import { Element } from './Constants.js';
import EffectSource from './EffectSource.js';
import BaseCard from './BaseCard.js';
import type Effect from './Effects/Effect.js';
import Game from './Game.js';

export type ElementSymbolInfo = {
    element: Element;
    key: string;
    prettyName: string;
};

interface PersistentEffectRecord {
    ref?: Effect[];
}

export class ElementSymbol extends EffectSource {
    printedType = 'elementSymbol';
    persistentEffects: PersistentEffectRecord[] = [];
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

