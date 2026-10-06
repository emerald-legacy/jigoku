import DrawCard from '../../DrawCard.js';
import { Location, CardType, ConflictType } from '../../Constants.js';
import { additionalAttackedProvince } from '../../effects.js';
import { conflictLastingEffect, reveal, sequential } from '../../GameActions/GameActions.js';

class AWarOnTwoFronts extends DrawCard {
    static id = 'a-war-on-two-fronts';

    setupCardAbilities() {
        this.reaction('Attack a second province')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && event.conflict.conflictType === ConflictType.Military && context.player.isMoreHonorable()
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card, context) => !card.isConflictProvince() && card.canBeAttacked() && (context.game.currentConflict?.getConflictProvinces() ?? []).some((a) => a.controller === card.controller)
            }, sequential([
                reveal(),
                conflictLastingEffect(context => ({
                    effect: additionalAttackedProvince(context.target)
                }))
            ]))
            .effect('{2}also attack {1} this conflict', context => [context.target, context.target.isFacedown() ? 'reveal and ' : '']);
    }
}


export default AWarOnTwoFronts;

