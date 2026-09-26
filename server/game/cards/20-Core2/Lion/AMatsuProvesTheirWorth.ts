import DrawCard from '../../../DrawCard.js';

export default class AMatsuProvesTheirWorth extends DrawCard {
    static id = 'a-matsu-proves-their-worth';

    setupCardAbilities() {
        this.ability
            .reaction({
                onConflictDeclared: (event, ctx) => {
                    const [bushi, ...others] = event.attackers ?? [];
                    return others.length === 0 && bushi?.controller === ctx.player && bushi.hasTrait('bushi')
                        ? { bushi, conflict: event.conflict }
                        : undefined;
                }
            })
            .title('Prove yourself worthy of a Matsu name')
            .effects(($effect, ctx) => {
                const { bushi, conflict } = ctx.matched;
                return [
                    $effect.delayed(bushi, {
                        when: { afterConflict: (event) => event.conflict === conflict },
                        if: () => bushi.isParticipating() && conflict.winner === ctx.player,
                        then: {
                            announce: ($message) =>
                                $message.freeform`${bushi} is honored and receives 1 fate, and ${ctx.player} gains 1 honor and draw 1 card due to ${bushi} succeeding at ${ctx.source}!`,
                            effects: ($effect) => [
                                $effect.honor(bushi),
                                $effect.placeFate(bushi, 1),
                                $effect.gainHonor(ctx.player, 1),
                                $effect.draw(ctx.player, 1)
                            ]
                        },
                        otherwise: {
                            announce: ($message) =>
                                $message.freeform`${bushi} is discarded from play due to failing at ${ctx.source}!`,
                            effects: ($effect) => [$effect.discardFromPlay(bushi)]
                        }
                    })
                ];
            })
            .addPrinted(($limit) => ({ max: $limit.per('conflict', 1) }));
    }
}
