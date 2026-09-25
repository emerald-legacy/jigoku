import { StrongholdCard } from '../../StrongholdCard.js';

export default class ShiroKitsuki extends StrongholdCard {
    static id = 'shiro-kitsuki';

    setupCardAbilities() {
        this.ability
            .reaction({ onConflictDeclared: () => true })
            .title('Name a card')
            .costs(($cost) => ({ named: $cost.nameCard() }))
            .announce(
                ($message, ctx) => $message.withIntro`claim a ring whenever ${ctx.opponent} plays a card named ${ctx.costs.named}`
            )
            .effects(($effect, ctx) => [
                $effect.eachTime(ctx.player, {
                    until: 'conflict',
                    when: {
                        onCardPlayed: (event) => event.player === ctx.opponent && event.card.name === ctx.costs.named
                    },
                    then: {
                        effects: ($effect) => [
                            $effect.chooseRing(
                                {
                                    prompt: 'Choose a ring to claim',
                                    filter: (ring) => ring.isUnclaimed(),
                                    announce: ($message, ring) => $message.freeform`${ctx.player} claims the ${ring}`
                                },
                                (ring) => $effect.claimRingAsPolitical(ring, { gainFate: true })
                            )
                        ]
                    }
                })
            ])
            .addPrinted(($limit) => ({ limit: $limit.unlimitedPerConflict() }));
    }
}
