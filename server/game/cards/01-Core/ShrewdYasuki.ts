import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShrewdYasuki extends DrawCard {
    static id = 'shrewd-yasuki';

    setupCardAbilities() {
        this.action({
            title: 'Look at top 2 cards of conflict deck',
            condition: context => context.player.conflictDeck.length > 0 && context.source.isParticipating() &&
                                  this.game.allCards.some(card => card.type === CardType.Holding && card.location.includes('province') && card.isFaceup()),
            effect: 'look at the top two cards of their conflict deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 2,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                }),
                shuffle: false,
                reveal: false,
                placeOnBottomInRandomOrder: true
            })
        });
    }
}


export default ShrewdYasuki;
