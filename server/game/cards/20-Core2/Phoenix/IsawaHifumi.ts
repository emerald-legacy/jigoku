import DrawCard from '../../../DrawCard.js';

export default class IsawaHifumi extends DrawCard {
    static id = 'isawa-hifumi';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Play an event from discard')
            .costsBeforeTargets(($cost) => ({ fate: $cost.fateFromCharacters((ctx) => ctx.timesResolved('round')) }))
            .targets(($target) => ({
                event: $target.card('event', { prompt: 'Choose an event', from: (ctx) => ctx.player.conflictDiscardPile })
            }))
            .announce(($message, ctx) =>
                // Once the costs are paid, this use counts: the number is the cost of the next use.
                $message.withIntro`play an event from their discard pile (the next time it is used this round will cost ${ctx.timesResolved('round')} fate from ${ctx.player} characters)`
            )
            .effects(($effect, ctx) => [$effect.playAsIfFromHand(ctx.targets.event, { givingEphemeral: true })])
            .addPrinted(($limit) => ({ limit: $limit.unlimited() }));
    }
}
