import { Elements } from './Constants.js';
import EffectSource from './EffectSource.js';
import BaseCard from './basecard.js';
import type Effect from './Effects/Effect.js';
import Game from './game.js';

type Info = {
    element: Elements
    key: string,
    prettyName: string,
}

interface PersistentEffectRecord {
    ref?: Effect[];
}

export class ElementSymbol extends EffectSource {
    printedType = 'elementSymbol';
    persistentEffects: PersistentEffectRecord[] = [];
    element: Elements;
    key: string;
    prettyName: string;

    constructor(game: Game, public card: BaseCard, info: Info) {
        super(game, `${info.prettyName} (${info.element})`);
        this.element = info.element;
        this.key = info.key;
        this.prettyName = info.prettyName;
    }
}

