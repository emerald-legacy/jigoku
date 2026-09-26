import { StrongholdCard } from '../../StrongholdCard.js';

export default class SevenStingsKeep extends StrongholdCard {
    static id = 'seven-stings-keep';

    setupCardAbilities() {
        this.ability
            .interrupt({ onConflictOpportunityAvailable: (event, ctx) => event.player === ctx.player })
            .title('Force defenders to assign first')
            .costs(($cost) => ({ stronghold: $cost.bowSelf() }))
            .announce(($message, ctx) =>
                $message.withIntro`force ${ctx.opponent} to declare defenders before attackers are chosen this conflict`
            )
            .effects(($effect, ctx) => [
                $effect.chooseNumber(
                    {
                        min: 1,
                        max: ctx.event.attackerMatrix?.maximumNumberOfAttackers ?? 0,
                        prompt: 'Choose how many characters will be attacking',
                        announce: ($message, attackers) =>
                            $message.freeform`${ctx.player} will attack with ${attackers} character${attackers === 1 ? '' : 's'}`
                    },
                    (attackers) =>
                        $effect.playerLastingEffect(ctx.player, ($modifier) => [$modifier.defendersChosenFirst(attackers)], {
                            until: 'conflict'
                        })
                )
            ])
            .addPrinted();
    }
}
