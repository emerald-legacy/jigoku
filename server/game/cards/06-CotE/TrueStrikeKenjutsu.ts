import { gainAbility } from '../../effects.js';
import { bow } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class TrueStrikeKenjutsu extends DrawCard {
    static id = 'true-strike-kenjutsu';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.action('Initiate a military duel', (ability) => ability
                .initiateDuel(() => ({
                    type: DuelType.Military,
                    gameAction: (duel) => bow({ target: duel.loser }),
                    statistic: (card, duelRules) => duelRules === 'printedSkill' ? card.printedMilitarySkill : card.getBaseMilitarySkill()
                })))
        });
    }
}
