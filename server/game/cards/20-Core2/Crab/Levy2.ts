import { Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class Levy2 extends DrawCard {
    static id = 'levy-2';

    public setupCardAbilities() {
        this.action({
            title: 'Take an honor or a fate from your opponent',
            condition: (context) => context.player.opponent !== undefined,
            target: {
                player: Players.Opponent,
                mode: TargetMode.Select,
                choices: {
                    'Give your opponent 1 fate': AbilityDsl.actions.takeFate(),
                    'Give your opponent 1 honor': AbilityDsl.actions.takeHonor()
                }
            },
            then: {
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.player.hand.length < (context.player.opponent?.hand.length ?? 0),
                    trueGameAction: AbilityDsl.actions.draw(context => ({
                        target: context.player,
                        amount: 1
                    })),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            },
            effect: 'take 1 {1} from {2}{3}',
            effectArgs: context => [
                context.select === 'Give your opponent 1 fate' ? 'fate' : 'honor',
                context.player.opponent ?? '',
                context.player.hand.length <= (context.player.opponent?.hand.length ?? 0) ? ' and draw a card' : ''
            ]
        });
    }
}
