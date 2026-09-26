import DrawCard from '../../DrawCard.js';

export default class HigesSermon extends DrawCard {
    static id = 'hige-s-sermon';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Bow characters')
            .duringPhase('draw')
            .targets(($target) => ({
                characters: $target.inPlayerOrder((player, $target) =>
                    $target.card('character', {
                        chooser: player,
                        prompt: 'Choose a character to bow',
                        filter: (card) => card.controller !== player
                    })
                )
            }))
            .announce(($message, ctx) => $message.withIntro`bow ${ctx.targets.characters.map(({ choice }) => choice)}`)
            .effects(($effect, ctx) => [$effect.bow(ctx.targets.characters.map(({ choice }) => choice))])
            .addPrinted();
    }
}
