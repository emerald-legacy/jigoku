import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SmugglersCove extends ProvinceCard {
    static id = 'smuggler-s-cove';

    setupCardAbilities() {
        this.action('Moves a character to or from a conflict at this province')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.conditional({
                condition: (context) => !!context.target?.isDrawCard() && context.target.isParticipating(),
                trueGameAction: AbilityDsl.actions.sendHome(),
                falseGameAction: AbilityDsl.actions.moveToConflict()
            }));
    }
}
