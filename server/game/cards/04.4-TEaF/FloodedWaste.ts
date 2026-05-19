import { CardTypes } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FloodedWaste extends ProvinceCard {
    static id = 'flooded-waste';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow each attacking character',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.bow(() => ({
                target: this.game.findAnyCardsInPlay(
                    (card) => card.getType() === CardTypes.Character && card.isAttacking()
                )
            }))
        });
    }
}
