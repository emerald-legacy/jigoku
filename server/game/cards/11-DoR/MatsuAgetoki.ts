import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MatsuAgetoki extends DrawCard {
    static id = 'matsu-agetoki';

    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another eligible province',
            condition: context => context.player && context.player.opponent && context.player.isMoreHonorable() && context.source.isAttacking(),
            gameAction: AbilityDsl.actions.selectCard(context => ({
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict(),
                message: '{0} moves the conflict to {1}',
                messageArgs: card => [context.player, card]
            })),
            effect: 'move the conflict to another eligible province'
        });
    }
}


export default MatsuAgetoki;
