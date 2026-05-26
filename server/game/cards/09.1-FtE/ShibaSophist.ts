import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShibaSophist extends DrawCard {
    static id = 'shiba-sophist';

    setupCardAbilities() {
        this.action({
            title: 'Search top 5 card for a card with the contested ring trait',
            condition: context => context.source.isParticipating(),
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: card => this.game.currentConflict?.elements.some(element => card.hasTrait(element)) ?? false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}


export default ShibaSophist;

