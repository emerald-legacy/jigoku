import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes, EffectNames } from '../../Constants.js';

class BayushiGensato extends DrawCard {
    static id = 'bayushi-gensato';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: duel => AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow({ target: duel.loser }),
                    AbilityDsl.actions.dishonor({ target: duel.winner })
                ]),
                statistic: (card) => card.getMilitarySkillExcludingModifiers([EffectNames.AttachmentMilitarySkillModifier, EffectNames.AttachmentPoliticalSkillModifier])
            }
        });
    }
}


export default BayushiGensato;
