import { StrongholdCard } from '../../StrongholdCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class YojinNoShiro extends StrongholdCard {
    static id = 'yojin-no-shiro';

    setupCardAbilities() {
        this.action('Give attacking characters +1/+0')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.isAttacking()),
                effect: AbilityDsl.effects.modifyMilitarySkill(1)
            })))
            .effect('give attacking characters +1{1}/+0{2}', () => ['military', 'political']);
    }
}
