import { injure, placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';

export default class MotoZealot extends DrawCard {
    static id = 'moto-zealot';

    setupCardAbilities() {
        this.conflictAction('Pressure a character')
            .condition(context => context.source.isAttacking() && !!context.game.currentConflict && !!context.player.opponent && !context.game.currentConflict.hasMoreParticipants(context.player.opponent))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Injure this character': injure((context) => ({ target: context.targets.character })),
                'Place 1 fate on opponent\'s character': placeFate()
            });
    }
}
