import { CardType, ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';

export default class ShizukaToshi extends StrongholdCard {
    static id = 'shizuka-toshi';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(costs.bowSelf())
            .condition(() => this.game.isDuringConflict(ConflictType.Political))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.politicalSkill <= 2
            }, bow());
    }
}
