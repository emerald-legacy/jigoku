import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Location, CardType, Duration, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AWarOnTwoFronts extends DrawCard {
    static id = 'a-war-on-two-fronts';

    setupCardAbilities() {
        this.reaction('Attack a second province')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && event.conflict.conflictType === ConflictType.Military && context.player.isMoreHonorable()
            })
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card, context) => !(card).isConflictProvince() && (card).canBeAttacked() && (context.game.currentConflict?.getConflictProvinces() ?? []).some((a: ProvinceCard) => a.controller === card.controller)
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.reveal(),
                AbilityDsl.actions.conflictLastingEffect(context => ({
                    duration: Duration.UntilEndOfConflict,
                    effect: AbilityDsl.effects.additionalAttackedProvince(context.target)
                }))
            ]))
            .effect('{2}also attack {1} this conflict!', context => [context.target ?? '', context.target?.isFacedown() ? 'reveal and ' : '']);
    }
}


export default AWarOnTwoFronts;

