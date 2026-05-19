import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type DrawCard from '../../../drawcard.js';
import { StrongholdCard } from '../../../StrongholdCard.js';

export default class BreezeOfDawnLodge extends StrongholdCard {
    static id = 'breeze-of-dawn-lodge';

    stealFirstPlayerDuringSetupWithMsg = '{0} takes the first player token. The speed of Lady Shinjo!';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card: DrawCard) => !card.bowed,
                gameAction: AbilityDsl.actions.conditional(({ target }) => ({
                    condition: () => target.isParticipating(),
                    trueGameAction: AbilityDsl.actions.sendHome({ target }),
                    falseGameAction: AbilityDsl.actions.moveToConflict({ target })
                }))
            }
        });
    }
}
