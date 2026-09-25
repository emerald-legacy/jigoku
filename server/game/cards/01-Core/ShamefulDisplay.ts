import { ProvinceCard } from '../../ProvinceCard.js';

export default class ShamefulDisplay extends ProvinceCard {
    static id = 'shameful-display';

    setupCardAbilities() {
        this.ability
            .conflictAction()
            .title('Dishonor/Honor two characters')
            .targets(($target) => ({
                characters: $target.cards('character', {
                    exactly: 2,
                    prompt: 'Select two characters',
                    filter: (card) => card.isParticipating()
                })
            }))
            .announce(($message, ctx) => $message.withIntro`change the personal honor of ${ctx.targets.characters}`)
            .effects(($effect, ctx) => [
                $effect.assign(ctx.targets.characters, {
                    honor: (card) => $effect.honor(card),
                    dishonor: (card) => $effect.dishonor(card)
                })
            ])
            .addPrinted();
    }
}
