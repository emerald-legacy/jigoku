import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class AsahinaArtisan extends DrawCard {
    static id = 'asahina-artisan';

    setupCardAbilities() {
        this.action('Give a character +0/+3')
            .cost(costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source && card.isFaction('crane')
            }, cardLastingEffect({
                effect: modifyPoliticalSkill(3)
            }))
            .chatText((context) => msg`give ${context.chatTarget()} +3${'political'} skill`);
    }
}


export default AsahinaArtisan;
