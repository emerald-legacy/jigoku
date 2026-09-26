import { StrongholdCard } from '../../StrongholdCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShiroNishiyama extends StrongholdCard {
    static id = 'shiro-nishiyama';

    setupCardAbilities() {
        this.action('Give defending characters +1/+1')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.isDefending()),
                effect: AbilityDsl.effects.modifyBothSkills(1)
            })))
            .effect('add +1{1}/+1{2} to all defenders they control', () => ['military', 'political']);
    }
}
