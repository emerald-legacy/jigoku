import DrawCard from '../../DrawCard.js';

export default class EvenTheOdds extends DrawCard {
    static id = 'even-the-odds';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Move a character to the conflict')
            .condition((ctx, util) => ctx.conflict !== undefined && util.outnumbered(ctx.player))
            .targets(($t) => ({ character: $t.card('character', { controller: (ctx) => ctx.player }) }))
            .effects(($e, ctx) => [
                $e.moveToConflict(ctx.targets.character),
                $e.if(ctx.targets.character.hasTrait('commander'), $e.honor(ctx.targets.character))
            ])
            .addPrinted();
    }
}
