import { Phases } from '../../../Constants.js';
import {
    conditional,
    draw,
    gainHonor,
    handler,
    honorBid,
    multiple,
    sequential,
    takeFate
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

type TanukiContext = AbilityContext & { fateTaken?: number };

export default class MischievousTanuki extends DrawCard {
    static id = 'mischievous-tanuki';

    public setupCardAbilities() {
        this.legendary(0);

        this.action('Set honor dials')
            .gameAction(honorBid({
                message: '{0}{1}{2}{3}',
                messageArgs: (context: TanukiContext) => {
                    if(context.player.showBid % 2 === (context.player.opponent?.showBid ?? 0) % 2) {
                        return [context.player, ` takes ${context.fateTaken} fate from `, context.player.opponent, ''];
                    } else if(context.player.showBid % 2 === 0) {
                        return [context.player, ' gains 2 honor and ', context.player.opponent, ' draws 2 cards'];
                    }
                    return [context.player, ' draws 2 cards and ', context.player.opponent, ' gains 2 honor'];
                },
                postBidAction: conditional({
                    condition: (context) => context.player.showBid % 2 === (context.player.opponent?.showBid ?? 0) % 2,
                    trueGameAction: sequential([
                        handler((context: TanukiContext) => ({
                            handler: () => {
                                context.fateTaken = Math.min(2, context.player.opponent?.getFate() ?? 0);
                            }
                        })),
                        takeFate((context: TanukiContext) => ({
                            target: context.player.opponent,
                            amount: context.fateTaken
                        }))
                    ]),
                    falseGameAction: multiple([
                        draw((context) => ({
                            target: context.player.showBid % 2 === 1 ? context.player : context.player.opponent,
                            amount: 2
                        })),
                        gainHonor((context) => ({
                            target: context.player.showBid % 2 === 0 ? context.player : context.player.opponent,
                            amount: 2
                        }))
                    ])
                })
            }))
            .effect('play a game')
            .phase(Phases.Conflict);
    }
}
