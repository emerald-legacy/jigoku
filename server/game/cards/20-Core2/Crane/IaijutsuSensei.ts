import { Durations, DuelTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class IaijutsuSensei extends DrawCard {
    static id = 'iaijutsu-sensei';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.attachments.filter((card) => card.hasTrait('weapon')).length === 1,
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.action({
            title: 'Military duel to stop contribution',
            initiateDuel: {
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                challengerCondition: (card) => card.isParticipating(),
                targetCondition: (card) => card.isParticipating() && !card.bowed,
                message: 'prevent {0} from contributing to resolution of this conflict',
                messageArgs: (duel) => duel.loser,
                gameAction: (duel) =>
                    AbilityDsl.actions.cardLastingEffect((_context) => ({
                        target: duel.loser,
                        effect: [AbilityDsl.effects.cannotContribute(() => (card: any) => (duel.loser ?? []).includes(card))],
                        duration: Durations.UntilEndOfConflict
                    }))
            }
        });
    }
}
