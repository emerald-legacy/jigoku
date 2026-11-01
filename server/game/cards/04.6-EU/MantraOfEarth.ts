import { Element, RestrictionType, RestrictionScope } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { makeMantra } from '../makeMantra.js';

export default makeMantra(
    'mantra-of-earth',
    Element.Earth,
    'Make a monk untargetable by opponents\' card effects and draw a card',
    cardLastingEffect((context) => ({
        effect: cardCannot({
            cannot: RestrictionType.Target,
            appliesTo: RestrictionScope.OpponentsCardEffects,
            applyingPlayer: context.player
        })
    })),
    'make {0} untargetable by opponents\' card effects and draw a card'
);
