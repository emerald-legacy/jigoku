import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class CompellingTestimony extends DrawCard {
    static id = 'compelling-testimony';

    override setupCardAbilities() {
        this.action('Give a character -4 political')
            .condition((context) => context.game.isDuringConflict(ConflictType.Political))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyPoliticalSkill(-4)
            }))
            .chatText((context) => msg`give ${context.chatTarget()} -4${'political'}`);
    }
}


export default CompellingTestimony;
