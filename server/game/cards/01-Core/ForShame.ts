import DrawCard from '../../DrawCard.js';

export default class ForShame extends DrawCard {
    static id = 'for-shame';

    setupCardAbilities() {
        this.ability
            .conflictAction()
            .title('Dishonor or bow a character')
            .condition((ctx) =>
                ctx.player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('courtier'))
            )
            .targets(($target) => ({
                character: $target.card('character', {
                    controller: (ctx) => ctx.opponent,
                    filter: (card) => card.isParticipating()
                })
            }))
            .targets(($target) => ({
                choice: $target.select({
                    chooser: (ctx) => ctx.opponent,
                    options: { dishonor: 'Dishonor this character', bow: 'Bow this character' }
                })
            }))
            .effects(($effect, ctx) => [
                $effect.forChoice(ctx.targets.choice, {
                    dishonor: $effect.dishonor(ctx.targets.character),
                    bow: $effect.bow(ctx.targets.character)
                })
            ])
            .addPrinted();
    }
}
