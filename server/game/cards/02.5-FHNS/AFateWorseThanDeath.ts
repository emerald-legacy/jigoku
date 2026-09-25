import DrawCard from '../../DrawCard.js';

export default class AFateWorseThanDeath extends DrawCard {
    static id = 'a-fate-worse-than-death';

    setupCardAbilities() {
        this.ability
            .conflictAction()
            .title('Bow, move home, dishonor, remove a fate and blank a character')
            .targets(($target) => ({ character: $target.card('character', { filter: (card) => card.isParticipating() }) }))
            .announce(
                ($message, ctx) =>
                    $message.withIntro`bow, dishonor, blank, move home, and remove a fate from ${ctx.targets.character}`
            )
            .effects(($effect, ctx) => [
                $effect.bow(ctx.targets.character),
                $effect.dishonor(ctx.targets.character),
                $effect.removeFate(ctx.targets.character),
                $effect.sendHome(ctx.targets.character),
                $effect.lastingEffect(ctx.targets.character, ($modifier) => [$modifier.blank()], { until: 'phase' })
            ])
            .addPrinted();
    }
}
