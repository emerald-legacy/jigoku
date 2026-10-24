import { bow } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';

class PressOfBattle extends DrawCard {
    static id = 'press-of-battle';

    override setupCardAbilities() {
        this.action('Bow a non-unique character')
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .ifCondition((context) => !!this.game.currentConflict?.hasMoreParticipants(context.player))
            .target({
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && !card.isUnique()
            }, bow());
    }
}


export default PressOfBattle;
