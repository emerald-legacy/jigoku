import { CardType, Element, Players } from '../../Constants.js';
import { reduceCost } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import { makeMantra } from '../makeMantra.js';

export default makeMantra(
    'mantra-of-void',
    Element.Void,
    'Reduce the cost to attach to a monk by 1',
    playerLastingEffect((context) => ({
        target: Players.Self,
        effect: reduceCost({
            amount: 1,
            cardType: CardType.Attachment,
            targetCondition: (target) => target === context.target
        })
    })),
    'reduce the cost of attachments they play on {0} this conflict by 1 and draw a card'
);
