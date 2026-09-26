import DrawCard from '../../DrawCard.js';

export default class RecklessAvenger extends DrawCard {
    static id = 'reckless-avenger';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Ready and honor characters')
            .condition((ctx) =>
                [ctx.player, ctx.opponent].some((player) => player?.cardsInPlay.some((card) => card.bowed))
            )
            .targets(($target) => ({
                chosen: $target.inPlayerOrder((player, $target) =>
                    $target.optionalCard('character', {
                        chooser: player,
                        controller: player,
                        prompt: 'Choose a character',
                        hideIfNoLegalTargets: true
                    })
                )
            }))
            .announce(($message, ctx) => {
                const [first, second] = ctx.targets.chosen.map(({ choice }) => choice);
                return second
                    ? $message.withIntro`ready ${first} and honor ${second}`
                    : $message.withIntro`ready ${first}`;
            })
            .effects(($effect, ctx) => {
                const [first, second] = ctx.targets.chosen.map(({ choice }) => choice);
                return [$effect.ready(first), $effect.honor(second)];
            })
            .addPrinted();
    }
}
