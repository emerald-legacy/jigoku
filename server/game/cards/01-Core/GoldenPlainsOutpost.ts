import { CardTypes, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class GoldenPlainsOutpost extends StrongholdCard {
    static id = 'golden-plains-outpost';

    setupCardAbilities() {
        this.action({
            title: 'Move a cavalry character to the conflict',
            cost: AbilityDsl.costs.bowSelf(),
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('cavalry'),
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}
