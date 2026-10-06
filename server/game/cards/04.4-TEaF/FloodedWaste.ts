import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { bow } from '../../GameActions/GameActions.js';

export default class FloodedWaste extends ProvinceCard {
    static id = 'flooded-waste';

    setupCardAbilities() {
        this.reaction('Bow each attacking character')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(bow(() => ({
                target: this.game.findAnyCardsInPlay(
                    (card) => card.getType() === CardType.Character && card.isAttacking()
                )
            })));
    }
}
