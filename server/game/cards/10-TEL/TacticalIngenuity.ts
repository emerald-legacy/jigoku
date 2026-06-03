import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, Location } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class TacticalIngenuity extends DrawCard {
    static id = 'tactical-ingenuity';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'commander'
        });
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Reveal and draw an event',
                condition: (context: AbilityContext) => context.source.isParticipating(),
                effect: 'look at the top four cards of their deck',
                gameAction: AbilityDsl.actions.deckSearch({
                    amount: 4,
                    cardCondition: (card) => card.type === CardType.Event,
                    gameAction: AbilityDsl.actions.moveCard({
                        destination: Location.Hand
                    })
                })
            })
        });
    }
}


export default TacticalIngenuity;
