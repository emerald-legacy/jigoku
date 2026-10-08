import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { blank } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Duration, Phase } from '../../Constants.js';

class AgashaHiyori extends DrawCard {
    static id = 'agasha-hiyori';

    setupCardAbilities() {
        this.reaction('Blank an attachment')
            .when({
                onPhaseStarted: (event) => event.phase !== Phase.Setup
            })
            .cost(costs.payFateToRing(1))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter)
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            }))
            .effect('treat {1} as if its printed text box were blank and as if it had no skill modifiers until the end of the phase', (context) => context.target);
    }
}


export default AgashaHiyori;
