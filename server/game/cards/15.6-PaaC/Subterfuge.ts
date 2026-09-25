import DrawCard from '../../DrawCard.js';

export default class Subterfuge extends DrawCard {
    static id = 'subterfuge';

    setupCardAbilities() {
        this.ability
            .wouldInterrupt({
                onCardsDrawn: (event, ctx) =>
                    ctx.opponent !== undefined &&
                    ctx.player.isLessHonorable() &&
                    ctx.game.currentPhase !== 'draw' &&
                    event.player === ctx.opponent
            })
            .title('Prevent draw')
            .announce(($message, ctx) => {
                const { amount } = ctx.event;
                const discarded = Math.min(amount, 3);
                const drawn = amount - discarded;
                return [
                    $message.withIntro`prevent ${discarded} card${amount > 1 ? 's' : ''} from being drawn, discarding ${amount > 1 ? 'them' : 'it'} instead`,
                    $message.freeform`${ctx.opponent} discards ${ctx.opponent?.conflictDeck.slice(0, discarded)}`,
                    drawn > 0 ? $message.freeform`${ctx.opponent} draws ${drawn} card${drawn > 1 ? 's' : ''}` : $message.none()
                ];
            })
            .effects(($effect, ctx) => {
                const discarded = Math.min(ctx.event.amount, 3);
                return [
                    $effect.instead([
                        $effect.discard(ctx.opponent?.conflictDeck.slice(0, discarded)),
                        $effect.draw(ctx.opponent, ctx.event.amount - discarded)
                    ])
                ];
            })
            .addPrinted();
    }
}
