import DrawCard from '../../DrawCard.js';

export default class HandToHand extends DrawCard {
    static id = 'hand-to-hand';

    setupCardAbilities() {
        this.ability
            .militaryConflictAction()
            .title('Discard an attachment')
            .targets(($target) => ({
                attachment: $target.card('attachment', { filter: (card) => Boolean(card.parentCharacter?.isParticipating()) })
            }))
            .announce(($message, ctx) => $message.withIntro`discard ${ctx.targets.attachment} from play`)
            .effects(($effect, ctx) => [$effect.discardFromPlay(ctx.targets.attachment)])
            .then()
            .effects(($effect, ctx) => [
                $effect.may(ctx.opponent, $effect.resolveThisAbility({ player: ctx.opponent }), {
                    prompt: `Resolve ${ctx.source.name}'s ability again?`,
                    description: `resolve ${ctx.source.name}'s ability again`
                })
            ])
            .addPrinted();
    }
}
