import DrawCard from '../../DrawCard.js';

export default class AFateWorseThanDeath extends DrawCard {
    static id = 'a-fate-worse-than-death';

    setupCardAbilities() {
        this.ability
            .conflictAction()
            .title('Bow, move home, dishonor, remove a fate and blank a character')
            .targets(($t) => ({ character: $t.card('character', { filter: (card) => card.isParticipating() }) }))
            .announce(
                ($m, ctx) =>
                    $m.withIntro`bow, dishonor, blank, move home, and remove a fate from ${ctx.targets.character}`
            )
            .effects(($e, ctx) => [
                $e.bow(ctx.targets.character),
                $e.dishonor(ctx.targets.character),
                $e.removeFate(ctx.targets.character),
                $e.sendHome(ctx.targets.character),
                $e.lastingEffect(ctx.targets.character, ($mod) => [$mod.blank()], { until: 'phase' })
            ])
            .addPrinted();
    }
}
