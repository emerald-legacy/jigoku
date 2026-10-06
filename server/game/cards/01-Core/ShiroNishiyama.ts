import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

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
            .effect('add +1{1}/+1{2} to all defenders they control', () => ['military', 'political']);
    }
}
