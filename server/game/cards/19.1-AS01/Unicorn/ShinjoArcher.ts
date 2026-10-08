import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoArcher extends DrawCard {
    static id = 'shinjo-archer';

    public setupCardAbilities() {
        this.action('Move and give -2/-2')
            .cost(costs.switchLocation())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyBothSkills(-2)
            }))
            .chatText((context) => msg`give ${context.chatTarget()} -2${'military'}/-2${'political'}`);
    }
}
