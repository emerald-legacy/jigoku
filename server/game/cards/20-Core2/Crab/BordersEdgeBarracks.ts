import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BordersEdgeBarracks extends DrawCard {
    static id = 'border-s-edge-barracks';

    setupCardAbilities() {
        this.action('Move a character to the conflict')
            .condition((context) => context.player.isDefendingPlayer())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.moveToConflict())
            .limit(AbilityDsl.limit.perConflict(1));
    }
}
