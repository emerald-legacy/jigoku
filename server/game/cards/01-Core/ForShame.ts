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
            .targets(($t) => ({
                character: $t.card('character', {
                    controller: (ctx) => ctx.opponent,
                    filter: (card) => card.isParticipating()
                })
            }))
            .targets(($t) => ({
                choice: $t.select({
                    chooser: (ctx) => ctx.opponent,
                    options: { dishonor: 'Dishonor this character', bow: 'Bow this character' }
                })
            }))
            .effects(($e, ctx) => [
                ctx.targets.choice === 'dishonor' ? $e.dishonor(ctx.targets.character) : $e.bow(ctx.targets.character)
            ])
            .addPrinted();
    }
}
