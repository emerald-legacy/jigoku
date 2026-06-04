import ExactlyXCardSelector from './CardSelectors/ExactlyXCardSelector.js';
import ExactlyVariableXCardSelector from './CardSelectors/ExactlyVariableXCardSelector.js';
import MaxStatCardSelector, { type MaxStatCardSelectorProperties } from './CardSelectors/MaxStatCardSelector.js';
import SingleCardSelector from './CardSelectors/SingleCardSelector.js';
import UnlimitedCardSelector from './CardSelectors/UnlimitedCardSelector.js';
import UpToXCardSelector from './CardSelectors/UpToXCardSelector.js';
import UpToVariableXCardSelector from './CardSelectors/UpToVariableXCardSelector.js';
import { TargetMode, CardType } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';

interface CardSelectorProperties {
    numCards?: number;
    cardCondition?: (...args: any[]) => boolean;
    numCardsFunc?: (context: AbilityContext) => number;
    cardType?: CardType | CardType[];
    multiSelect?: boolean;
    sameDiscardPile?: boolean;
    mode?: TargetMode;
    maxStat?: () => number;
    [key: string]: any;
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
    maxStat: (p) => new MaxStatCardSelector(p as MaxStatCardSelectorProperties),
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

        if(properties.maxStat) {
            properties.mode = TargetMode.MaxStat;
        } else if(properties.numCards === 1 && !properties.multiSelect) {
            properties.mode = TargetMode.Single;
        } else if(properties.numCards === 0) {
            properties.mode = TargetMode.Unlimited;
        } else {
            properties.mode = TargetMode.UpTo;
        }

        return properties;
    }
}

export default CardSelector;
