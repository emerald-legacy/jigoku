import { CardType, Players } from '../../Constants.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';
import AbilityDsl from '../../abilitydsl.js';

export default class TotalWarfare extends BattlefieldAttachment {
    static id = 'total-warfare';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.forcedReaction('Loser sacrifices a character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.loser && context.source.parentProvince?.isConflictProvince()
            })
            .target('target', {
                cardType: CardType.Character,
                player: (context) =>
                    context.player === this.game.currentConflict?.loser ? Players.Self : Players.Opponent,
                cardCondition: (card) => card.isParticipating() && card.controller === this.game.currentConflict?.loser
            }, AbilityDsl.actions.sacrifice());
    }
}
