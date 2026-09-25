import { ProvinceCard } from '../../ProvinceCard.js';

export default class ShamefulDisplay extends ProvinceCard {
    static id = 'shameful-display';

    setupCardAbilities() {
        this.ability
            .conflictAction()
            .title('Dishonor/Honor two characters')
            .targets(($t) => ({
                characters: $t.cards('character', {
                    exactly: 2,
                    prompt: 'Select two characters',
                    filter: (card) => card.isParticipating()
                })
            }))
            .announce(($m, ctx) => $m.withIntro`change the personal honor of ${ctx.targets.characters}`)
            .effects(($e, ctx) => [
                $e.assign(ctx.targets.characters, {
                    honor: (card) => $e.honor(card),
                    dishonor: (card) => $e.dishonor(card)
                })
            ])
            .addPrinted();
    }
}
