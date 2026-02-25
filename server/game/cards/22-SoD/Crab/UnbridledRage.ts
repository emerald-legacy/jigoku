import { Durations, DuelTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UnbridledRage extends DrawCard {
    static id = 'unbridled-rage';

    setupCardAbilities() {
        this.action({
            title: 'Military duel to stop contribution',
            condition: context => context.game.isDuringConflict(),
            initiateDuel: {
                type: DuelTypes.Military,
                challengerCondition: card => card.hasTrait('berserker'),
                message: 'prevent {0} from contributing to resolution of this conflict',
                refuseGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.draw(context => ({
                        amount: 2,
                        target: context.player
                    })),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        duration: Durations.UntilPassPriority,
                        effect: AbilityDsl.effects.additionalAction()
                    }))
                ]),
                refusalMessage: '{0} chooses to refuse the duel, allowing {1} to draw 2 cards and take an additional action',
                refusalMessageArgs: (context) => [
                    context.player.opponent,
                    context.player
                ],
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
