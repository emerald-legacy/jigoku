import { ProvinceCard } from '../../ProvinceCard.js';

export default class ShinseisLastHope extends ProvinceCard {
    static id = 'shinsei-s-last-hope';

    setupCardAbilities() {
        this.ability
            .constant()
            .affects(($a) => $a.you())
            .effects(($mod) => [
                $mod.reduceCostWhenPlayedFromProvince(2, (card, source) => card.location === source.location)
            ])
            .addPrinted();

        this.ability
            .constant()
            .affects(($a) =>
                $a.cards('character', {
                    in: 'provinces',
                    controller: (ctx) => ctx.player,
                    filter: (card, ctx) => card.location === ctx.source.location
                })
            )
            .effects(($mod) => [$mod.entersPlayDishonored()])
            .addPrinted();
    }
}
