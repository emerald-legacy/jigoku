import { Durations, DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

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
                challengerCondition: (card, context) => !card.bowed && context.game.isDuringConflict(),
                message: 'prevent {0} from contributing to resolution of this conflict',
                messageArgs: (duel) => duel.loser,
                gameAction: (duel) =>
                    AbilityDsl.actions.cardLastingEffect((_context) => ({
                        target: duel.loser,
                        effect: [AbilityDsl.effects.cannotContribute(() => (card) => duel.loser.includes(card))],
                        duration: Durations.UntilEndOfConflict
                    }))
            }
        });
    }
}
