import { gainAbility } from '../../effects.js';
import { bow } from '../../GameActions/GameActions.js';
import { AbilityType, DuelType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class TrueStrikeKenjutsu extends DrawCard {
    static id = 'true-strike-kenjutsu';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Initiate a military duel',
                initiateDuel: {
                    type: DuelType.Military,
                    gameAction: (duel) => bow({ target: duel.loser }),
                    statistic: (card) => card.getBaseMilitarySkill()
                },
                printedAbility: false
            })
        });
    }
}
