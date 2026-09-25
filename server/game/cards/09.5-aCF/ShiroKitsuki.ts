import { StrongholdCard } from '../../StrongholdCard.js';

export default class ShiroKitsuki extends StrongholdCard {
    static id = 'shiro-kitsuki';

    setupCardAbilities() {
        this.ability
            .reaction({ onConflictDeclared: () => true })
            .title('Name a card')
            .costs(($c) => ({ named: $c.nameCard() }))
            .announce(
                ($m, ctx) => $m.withIntro`claim a ring whenever ${ctx.opponent} plays a card named ${ctx.costs.named}`
            )
            .effects(($e, ctx) => [
                $e.eachTime(ctx.player, {
                    until: 'conflict',
                    when: {
                        onCardPlayed: (event) => event.player === ctx.opponent && event.card.name === ctx.costs.named
                    },
                    then: {
                        effects: ($e) => [
                            $e.chooseRing(
                                {
                                    prompt: 'Choose a ring to claim',
                                    filter: (ring) => ring.isUnclaimed(),
                                    announce: ($m, ring) => $m.freeform`${ctx.player} claims the ${ring}`
                                },
                                (ring) => $e.claimRingAsPolitical(ring, { gainFate: true })
                            )
                        ]
                    }
                })
            ])
            .addPrinted(($limit) => ({ limit: $limit.unlimitedPerConflict() }));
    }
}
