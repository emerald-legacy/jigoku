import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class BordersEdgeBarracks extends DrawCard {
    static id = 'border-s-edge-barracks';

    setupCardAbilities() {
        this.action({
            title: 'Move a character to the conflict',
            condition: (context) => context.player.isDefendingPlayer(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveToConflict()
            },
            limit: AbilityDsl.limit.perConflict(1)
        });
    }
}
