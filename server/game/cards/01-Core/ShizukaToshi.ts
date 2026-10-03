import { CardType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShizukaToshi extends StrongholdCard {
    static id = 'shizuka-toshi';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => this.game.isDuringConflict('political'))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.politicalSkill <= 2
            }, AbilityDsl.actions.bow());
    }
}
