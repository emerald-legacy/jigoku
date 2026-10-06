import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class ShiroNishiyama extends StrongholdCard {
    static id = 'shiro-nishiyama';

    setupCardAbilities() {
        this.action('Give defending characters +1/+1')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .gameAction(cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.isDefending()),
                effect: modifyBothSkills(1)
            })))
            .effect(() => msg`add +1${'military'}/+1${'political'} to all defenders they control`);
    }
}
