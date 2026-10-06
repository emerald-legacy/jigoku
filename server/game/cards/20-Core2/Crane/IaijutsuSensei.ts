import { DuelType } from '../../../Constants.js';
import { cannotContribute, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IaijutsuSensei extends DrawCard {
    static id = 'iaijutsu-sensei';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.attachments.filter((card) => card.hasTrait('weapon')).length === 1,
            effect: modifyBothSkills(1)
        });

        this.action('Military duel to stop contribution')
            .initiateDuel(() => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                challengerCondition: (card) => card.isParticipating(),
                targetCondition: (card) => card.isParticipating() && !card.bowed,
                message: 'prevent {0} from contributing to resolution of this conflict',
                messageArgs: (duel) => duel.loser,
                gameAction: (duel) =>
                    cardLastingEffect({
                        target: duel.loser,
                        effect: [cannotContribute(() => (card) => (duel.loser ?? []).includes(card))]
                    })
            }));
    }
}
