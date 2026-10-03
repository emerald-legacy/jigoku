import ExactlyXCardSelector from './CardSelectors/ExactlyXCardSelector.js';
import ExactlyVariableXCardSelector from './CardSelectors/ExactlyVariableXCardSelector.js';
import MaxStatCardSelector from './CardSelectors/MaxStatCardSelector.js';
import SingleCardSelector from './CardSelectors/SingleCardSelector.js';
import UnlimitedCardSelector from './CardSelectors/UnlimitedCardSelector.js';
import UpToXCardSelector from './CardSelectors/UpToXCardSelector.js';
import UpToVariableXCardSelector from './CardSelectors/UpToVariableXCardSelector.js';
import { TargetMode, CardType } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type { BaseCardSelectorProperties } from './CardSelectors/BaseCardSelector.js';
import type BaseCard from './BaseCard.js';

export interface CardSelectorProperties extends BaseCardSelectorProperties {
    numCards?: number;
    numCardsFunc?: (context: AbilityContext) => number;
    multiSelect?: boolean;
    mode?: TargetMode;
    maxStat?: () => number;
    cardStat?: (card: BaseCard) => number;
}

/** Modes whose selector passes the chosen card on its own. */
export type SingleCardMode = TargetMode.Single | TargetMode.AutoSingle | TargetMode.Ability | TargetMode.Token | TargetMode.ElementSymbol;
export type MultiCardMode = TargetMode.Exactly | TargetMode.ExactlyVariable | TargetMode.MaxStat | TargetMode.Unlimited | TargetMode.UpTo | TargetMode.UpToVariable;

const MULTI_CARD_MODES: readonly TargetMode[] = [
    TargetMode.Exactly, TargetMode.ExactlyVariable, TargetMode.MaxStat, TargetMode.Unlimited, TargetMode.UpTo, TargetMode.UpToVariable
];

export function isMultiCardMode(mode: TargetMode): mode is MultiCardMode {
    return MULTI_CARD_MODES.includes(mode);
}

/** The mode a selector gets when none is given. */
export function defaultMode({ numCards = 1, multiSelect = false, maxStat }: Pick<CardSelectorProperties, 'numCards' | 'multiSelect' | 'maxStat'>): TargetMode {
    if(maxStat) {
        return TargetMode.MaxStat;
    } else if(numCards === 1 && !multiSelect) {
        return TargetMode.Single;
    } else if(numCards === 0) {
        return TargetMode.Unlimited;
    }
    return TargetMode.UpTo;
}

type BaseSelector = SingleCardSelector | ExactlyXCardSelector | ExactlyVariableXCardSelector |
    MaxStatCardSelector | UnlimitedCardSelector | UpToXCardSelector | UpToVariableXCardSelector;

const defaultProperties: CardSelectorProperties = {
    numCards: 1,
    cardCondition: () => true,
    numCardsFunc: () => 1,
    cardType: [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding, CardType.Stronghold, CardType.Role, CardType.Province],
    multiSelect: false,
    sameDiscardPile: false
};

const ModeToSelector: Record<string, (p: CardSelectorProperties) => BaseSelector> = {
    ability: (p) => new SingleCardSelector(p),
    autoSingle: (p) => new SingleCardSelector(p),
    exactly: (p) => new ExactlyXCardSelector(p.numCards ?? 1, p),
    exactlyVariable: (p) => new ExactlyVariableXCardSelector(p.numCardsFunc ?? (() => 1), p),
    maxStat: (p) => {
        const { cardStat, maxStat } = p;
        if(!cardStat || !maxStat) {
            throw new Error('A maxStat card selector needs cardStat and maxStat');
        }
        return new MaxStatCardSelector({ ...p, cardStat, maxStat, numCards: p.numCards ?? 1 });
    },
    single: (p) => new SingleCardSelector(p),
    token: (p) => new SingleCardSelector(p),
    elementSymbol: (p) => new SingleCardSelector(p),
    unlimited: (p) => new UnlimitedCardSelector(p),
    upTo: (p) => new UpToXCardSelector(p.numCards ?? 1, p),
    upToVariable: (p) => new UpToVariableXCardSelector(p.numCardsFunc ?? (() => 1), p)
};

class CardSelector {
    static for(properties: CardSelectorProperties): BaseSelector {
        properties = CardSelector.getDefaultedProperties(properties);

        const factory = properties.mode ? ModeToSelector[properties.mode] : undefined;

        if(!factory) {
            throw new Error(`Unknown card selector mode of ${properties.mode}`);
        }

        return factory(properties);
    }

    static getDefaultedProperties(properties: CardSelectorProperties): CardSelectorProperties {
        properties = Object.assign({}, defaultProperties, properties);
        if(properties.mode) {
            return properties;
        }

        properties.mode = defaultMode(properties);

        return properties;
    }
}

export default CardSelector;
