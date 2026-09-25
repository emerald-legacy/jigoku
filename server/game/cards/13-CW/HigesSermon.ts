import DrawCard from '../../DrawCard.js';

export default class HigesSermon extends DrawCard {
    static id = 'hige-s-sermon';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Bow characters')
            .duringPhase('draw')
            .targets(($t) => ({
                characters: $t.inPlayerOrder((player, $t) =>
                    $t.card('character', {
                        chooser: player,
                        prompt: 'Choose a character to bow',
                        filter: (card) => card.controller !== player
                    })
                )
            }))
            .announce(($m, ctx) => $m.withIntro`bow ${ctx.targets.characters.map(({ choice }) => choice)}`)
            .effects(($e, ctx) => [$e.bow(ctx.targets.characters.map(({ choice }) => choice))])
            .addPrinted();
    }
}
