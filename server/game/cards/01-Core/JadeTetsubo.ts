import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { removeFate } from '../../GameActions/GameActions.js';

class JadeTetsubo extends DrawCard {
    static id = 'jade-tetsubo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Return all fate from a character')
            .cost(costs.bowSelf())
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.militarySkill < (context.source.parentCharacter?.militarySkill ?? 0)
            }, removeFate((context) => ({
                amount: context.target.getFate(),
                recipient: context.target.owner
            })))
            .chatText('return all fate from {0} to its owner');
    }
}


export default JadeTetsubo;
