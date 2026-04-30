import DrawCard from '../../drawcard';
import { Locations, CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class ShrewdYasuki extends DrawCard {
    static id = 'shrewd-yasuki';

    setupCardAbilities() {
        this.action({
            title: 'Look at top 2 cards of conflict deck',
            condition: context => context.player.conflictDeck.length > 0 && context.source.isParticipating() &&
                                  this.game.allCards.some(card => card.type === CardTypes.Holding && card.location.includes('province') && card.isFaceup()),
            effect: 'look at the top two cards of their conflict deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 2,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                }),
                shuffle: false,
                reveal: false,
                placeOnBottomInRandomOrder: true
            })
        });
    }
}


export default ShrewdYasuki;
