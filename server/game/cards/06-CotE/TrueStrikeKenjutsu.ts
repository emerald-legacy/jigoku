import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, DuelType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class TrueStrikeKenjutsu extends DrawCard {
    static id = 'true-strike-kenjutsu';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Initiate a military duel',
                initiateDuel: {
                    type: DuelType.Military,
                    gameAction: (duel: any) => AbilityDsl.actions.bow({ target: duel.loser }),
                    statistic: (card: any) => card.getBaseMilitarySkill()
                },
                printedAbility: false
            })
        });
    }
}
