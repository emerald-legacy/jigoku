import ExactlyXCardSelector from './CardSelectors/ExactlyXCardSelector';
import ExactlyVariableXCardSelector from './CardSelectors/ExactlyVariableXCardSelector';
import MaxStatCardSelector from './CardSelectors/MaxStatCardSelector';
import SingleCardSelector from './CardSelectors/SingleCardSelector';
import UnlimitedCardSelector from './CardSelectors/UnlimitedCardSelector';
import UpToXCardSelector from './CardSelectors/UpToXCardSelector';
import UpToVariableXCardSelector from './CardSelectors/UpToVariableXCardSelector';
import { TargetModes, CardTypes } from './Constants';

interface CardSelectorProperties {
    numCards?: number;
    cardCondition?: (...args: any[]) => boolean;
    numCardsFunc?: (...args: any[]) => number;
    cardType?: CardTypes | CardTypes[];
    multiSelect?: boolean;
    sameDiscardPile?: boolean;
    mode?: TargetModes;
    maxStat?: any;
    [key: string]: any;
}

type BaseSelector = SingleCardSelector | ExactlyXCardSelector | ExactlyVariableXCardSelector |
    MaxStatCardSelector | UnlimitedCardSelector | UpToXCardSelector | UpToVariableXCardSelector;

const defaultProperties: CardSelectorProperties = {
    numCards: 1,
    cardCondition: () => true,
    numCardsFunc: () => 1,
    cardType: [CardTypes.Attachment, CardTypes.Character, CardTypes.Event, CardTypes.Holding, CardTypes.Stronghold, CardTypes.Role, CardTypes.Province],
    multiSelect: false,
    sameDiscardPile: false
};

const ModeToSelector: Record<string, (p: CardSelectorProperties) => BaseSelector> = {
    ability: (p) => new SingleCardSelector(p),
    autoSingle: (p) => new SingleCardSelector(p),
    exactly: (p) => new ExactlyXCardSelector(p.numCards ?? 1, p),
    exactlyVariable: (p) => new ExactlyVariableXCardSelector(p.numCardsFunc ?? (() => 1), p),
    maxStat: (p) => new MaxStatCardSelector(p),
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
            properties.mode = TargetModes.MaxStat;
        } else if(properties.numCards === 1 && !properties.multiSelect) {
            properties.mode = TargetModes.Single;
        } else if(properties.numCards === 0) {
            properties.mode = TargetModes.Unlimited;
        } else {
            properties.mode = TargetModes.UpTo;
        }

        return properties;
    }
}

export = CardSelector;
