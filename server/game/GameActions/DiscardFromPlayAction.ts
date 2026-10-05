import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, Location } from '../Constants.js';
import type { CardActionProperties } from './CardGameAction.js';
import { LeavesPlayAction } from './LeavesPlayAction.js';

export type DiscardFromPlayProperties = CardActionProperties;

export class DiscardFromPlayAction<C extends AbilityContext = AbilityContext> extends LeavesPlayAction<DiscardFromPlayProperties, C> {
    name = 'discardFromPlay';
    cost = 'sacrificing {0}';
    targetType = [CardType.Character, CardType.Attachment, CardType.Holding];

    constructor(propertyFactory: DiscardFromPlayProperties | ((context: C) => DiscardFromPlayProperties), isSacrifice = false) {
        super(propertyFactory);
        if(isSacrifice) {
            this.name = 'sacrifice';
        }
    }

    protected effectMessage(): MessageArgs {
        return [this.name === 'sacrifice' ? 'sacrifice {0}' : 'discard {0}', []];
    }

    canAffect(card: BaseCard, context: C): boolean {
        if(card.type === CardType.Holding) {
            if(this.name === 'sacrifice' && card.facedown) {
                return false;
            }
            if(!card.location.includes('province')) {
                return false;
            }
        } else if(card.location !== Location.PlayArea) {
            return false;
        }
        return super.canAffect(card, context);
    }
}
