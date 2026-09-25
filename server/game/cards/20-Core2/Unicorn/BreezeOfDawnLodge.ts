import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { StrongholdCard } from '../../../StrongholdCard.js';

export default class BreezeOfDawnLodge extends StrongholdCard {
    static id = 'breeze-of-dawn-lodge';

    stealFirstPlayerDuringSetupWithMsg = '{0} takes the first player token. The speed of Lady Shinjo!';

    setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .cost(AbilityDsl.costs.bowSelf())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => !card.bowed
            }, AbilityDsl.actions.conditional(({ target }) => ({
                condition: () => !!target?.isParticipating(),
                trueGameAction: AbilityDsl.actions.sendHome({ target }),
                falseGameAction: AbilityDsl.actions.moveToConflict({ target })
            })));
    }
}
