import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, DuelTypes } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

export default class TrueStrikeKenjutsu extends DrawCard {
    static id = 'true-strike-kenjutsu';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Initiate a military duel',
                initiateDuel: {
                    type: DuelTypes.Military,
                    gameAction: (duel: any) => AbilityDsl.actions.bow({ target: duel.loser }),
                    statistic: (card: any) => card.getBaseMilitarySkill()
                },
                printedAbility: false
            })
        });
    }
}
