import type Player from '../../../Player.js';
import DrawCard from '../../../DrawCard.js';

function hasFewerCards(player: Player, opponent: Player): boolean {
    return player.hand.length < opponent.hand.length;
}

export default class Levy2 extends DrawCard {
    static id = 'levy-2';

    public setupCardAbilities() {
        this.ability
            .action()
            .title('Take an honor or a fate from your opponent')
            .targets(($target) => ({ opponent: $target.opponent() }))
            .targets(($target) => ({
                gift: $target.select({
                    chooser: (ctx) => ctx.targets.opponent,
                    options: { fate: 'Give your opponent 1 fate', honor: 'Give your opponent 1 honor' }
                })
            }))
            .announce(($message, ctx) => {
                const draws = hasFewerCards(ctx.player, ctx.targets.opponent);
                return $message.withIntro`take 1 ${ctx.targets.gift} from ${ctx.targets.opponent}${draws ? ' and draw a card' : ''}`;
            })
            .effects(($effect, ctx) => [
                $effect.forChoice(ctx.targets.gift, {
                    fate: $effect.takeFate({ from: ctx.targets.opponent }),
                    honor: $effect.takeHonor({ from: ctx.targets.opponent })
                }),
                $effect.if(hasFewerCards(ctx.player, ctx.targets.opponent), $effect.draw(ctx.player, 1))
            ])
            .addPrinted();
    }
}
