import DrawCard from '../../DrawCard.js';

export default class Forgery extends DrawCard {
    static id = 'forgery';

    setupCardAbilities() {
        this.ability
            .wouldInterrupt({
                onInitiateAbilityEffects: (event, ctx, util) =>
                    util.is(event.card, 'event') && ctx.opponent !== undefined && ctx.player.isLessHonorable()
            })
            .title('Cancel an event')
            .effects(($effect) => [$effect.cancel()])
            .addPrinted();
    }
}
