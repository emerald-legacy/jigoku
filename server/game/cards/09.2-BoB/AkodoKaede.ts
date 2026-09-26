import DrawCard from '../../DrawCard.js';

export default class AkodoKaede extends DrawCard {
    static id = 'akodo-kaede';

    setupCardAbilities() {
        this.ability
            .constant()
            .appliesTo(($subject) => $subject.self())
            .modifiers(($modifier) => [$modifier.immuneTo('opponentsRingEffects')])
            .addPrinted();

        this.ability
            .wouldInterrupt({
                onCardLeavesPlay: (event, ctx, util) =>
                    util.is(event.card, 'character') && event.card !== ctx.source && event.card.isInPlay()
                        ? event.card
                        : undefined
            })
            .title('Prevent a character from leaving play')
            .announce(($message, ctx) => $message.withIntro`prevent ${ctx.matched} from leaving play`)
            .effects(($effect, ctx) => [$effect.instead([$effect.removeFate(ctx.source)])])
            .addPrinted();
    }
}
