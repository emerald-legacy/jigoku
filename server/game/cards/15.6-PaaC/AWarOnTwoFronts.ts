import DrawCard from '../../drawcard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Locations, CardTypes, Durations, ConflictTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AWarOnTwoFronts extends DrawCard {
    static id = 'a-war-on-two-fronts';

    setupCardAbilities() {
        this.reaction({
            title: 'Attack a second province',
            when: {
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player && event.conflict.conflictType === ConflictTypes.Military && context.player.isMoreHonorable()
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card: any, context: any) => !card.isConflictProvince() && card.canBeAttacked() && context.game.currentConflict.getConflictProvinces().some((a: any) => a.controller === card.controller),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.reveal(),
                    AbilityDsl.actions.conflictLastingEffect(context => ({
                        duration: Durations.UntilEndOfConflict,
                        effect: AbilityDsl.effects.additionalAttackedProvince(context.target)
                    }))
                ])
            },
            effect: '{2}also attack {1} this conflict!',
            effectArgs: context => [(context.target as DrawCard), (context.target as ProvinceCard).isFacedown() ? 'reveal and ' : '']
        });
    }
}


export default AWarOnTwoFronts;

