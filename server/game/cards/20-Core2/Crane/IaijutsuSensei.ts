import { msg } from '../../../GameChat.js';
import { DuelType, RestrictionType, Trait } from '../../../Constants.js';
import { cardCannot, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IaijutsuSensei extends DrawCard {
    static id = 'iaijutsu-sensei';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.attachments.filter((card) => card.hasTrait(Trait.Weapon)).length === 1,
            effect: modifyBothSkills(1)
        });

        this.conflictAction('Military duel to stop contribution')
            .initiateDuel(() => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                challengerCondition: (card) => card.isParticipating(),
                targetCondition: (card) => card.isParticipating() && !card.bowed,
                chatText: (_context, duel) => msg`prevent ${duel.loser?.[0]} from contributing to resolution of this conflict`,
                gameAction: (duel) =>
                    cardLastingEffect({
                        target: duel.loser,
                        effect: cardCannot(RestrictionType.ContributeSkillToConflictResolution)
                    })
            }));
    }
}
