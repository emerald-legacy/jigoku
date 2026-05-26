import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IsawaUona extends DrawCard {
    static id = 'isawa-uona';

    setupCardAbilities(_ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Bow a non-unique character in the conflict',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('air') && this.game.isDuringConflict()
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && !card.isUnique(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default IsawaUona;
