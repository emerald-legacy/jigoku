import { msg } from '../../GameChat.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { playerDelayedEffect } from '../../effects.js';
import { flipDynasty } from '../../GameActions/GameActions.js';

export default class Kakudaira extends ProvinceCard {
    static id = 'kakudaira';

    setupCardAbilities() {
        this.persistentEffect({
            effect: playerDelayedEffect({
                when: {
                    onPhaseStarted: (_event, context) =>
                        context.source.isProvinceCard() &&
                        context.source.isFaceup() &&
                        !context.source.isBroken &&
                        context.player.getDynastyCardsInProvince(context.source.location).some((a) => a.isFacedown())
                },
                message: (effectContext) => msg`${effectContext.player} reveals ${effectContext.player
                    .getDynastyCardsInProvince(effectContext.source.location)
                    .filter((a) => a.isFacedown())} due to the constant effect of ${effectContext.source}`,
                gameAction: flipDynasty((context) => ({
                    target: context.player
                        .getDynastyCardsInProvince(context.source.location)
                        .filter((a) => a.isFacedown())
                }))
            })
        });
    }
}
