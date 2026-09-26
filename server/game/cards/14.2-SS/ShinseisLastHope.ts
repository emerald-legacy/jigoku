import { ProvinceCard } from '../../ProvinceCard.js';

export default class ShinseisLastHope extends ProvinceCard {
    static id = 'shinsei-s-last-hope';

    setupCardAbilities() {
        this.ability
            .constant()
            .appliesTo(($subject) => $subject.you())
            .modifiers(($modifier) => [
                $modifier.reduceCostWhenPlayedFromProvince(2, (card, source) => card.location === source.location)
            ])
            .addPrinted();

        this.ability
            .constant()
            .appliesTo(($subject) =>
                $subject.cards('character', {
                    in: 'provinces',
                    controller: (ctx) => ctx.player,
                    filter: (card, ctx) => card.location === ctx.source.location
                })
            )
            .modifiers(($modifier) => [$modifier.entersPlayDishonored()])
            .addPrinted();
    }
}
