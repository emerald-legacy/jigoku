import DrawCard from '../../DrawCard.js';
import { bow, dishonor, multiple } from '../../GameActions/GameActions.js';
import { DuelType, EffectName } from '../../Constants.js';

class BayushiGensato extends DrawCard {
    static id = 'bayushi-gensato';

    setupCardAbilities() {
        this.action('Initiate a military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: duel => multiple([
                    bow({ target: duel.loser }),
                    dishonor({ target: duel.winner })
                ]),
                statistic: (card) => card.getMilitarySkillExcludingModifiers([EffectName.AttachmentMilitarySkillModifier, EffectName.AttachmentPoliticalSkillModifier])
            }));
    }
}


export default BayushiGensato;
