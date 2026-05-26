import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class PressOfBattle extends DrawCard {
    static id = 'press-of-battle';

    setupCardAbilities(ability: any) {
        this.action({
            title: 'Bow a non-unique character',
            condition: context => this.game.isDuringConflict('military') &&
                                 !!this.game.currentConflict &&
                                 this.game.currentConflict.hasMoreParticipants(context.player, () => true),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => card.isParticipating() && !card.isUnique(),
                gameAction: ability.actions.bow()
            }
        });
    }
}


export default PressOfBattle;
