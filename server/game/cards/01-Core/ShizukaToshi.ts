import { CardTypes } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShizukaToshi extends StrongholdCard {
    static id = 'shizuka-toshi';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.isDuringConflict('political'),
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating() && card.politicalSkill <= 2,
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
