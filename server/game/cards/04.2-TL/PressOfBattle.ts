import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';

class PressOfBattle extends DrawCard {
    static id = 'press-of-battle';

    setupCardAbilities() {
        this.action('Bow a non-unique character')
            .condition(context => this.game.isDuringConflict(ConflictType.Military) &&
                                 !!this.game.currentConflict &&
                                 this.game.currentConflict.hasMoreParticipants(context.player))
            .target({
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && !card.isUnique()
            }, AbilityDsl.actions.bow());
    }
}


export default PressOfBattle;
