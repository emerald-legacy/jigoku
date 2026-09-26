import DrawCard from '../../DrawCard.js';

export default class EvenTheOdds extends DrawCard {
    static id = 'even-the-odds';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Move a character to the conflict')
            .condition((ctx, util) => ctx.conflict !== undefined && util.outnumbered(ctx.player))
            .targets(($target) => ({ character: $target.card('character', { controller: (ctx) => ctx.player }) }))
            .effects(($effect, ctx) => [
                $effect.moveToConflict(ctx.targets.character),
                $effect.if(ctx.targets.character.hasTrait('commander'), $effect.honor(ctx.targets.character))
            ])
            .addPrinted();
    }
}
