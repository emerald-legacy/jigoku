import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SeekerInitiate extends DrawCard {
    static id = 'seeker-initiate';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 5 cards',
            when: {
                onClaimRing: (event: any, context) => !!context.player.role && ((event.conflict && event.conflict.elements.some((element: any) => context.player.role?.hasTrait(element))) || context.player.role?.hasTrait(event.ring.element)) &&
                                                 event.player === context.player && context.player.conflictDeck.length > 0
            },
            effect: 'look at the top 5 cards of their conflict deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                reveal: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}


export default SeekerInitiate;
