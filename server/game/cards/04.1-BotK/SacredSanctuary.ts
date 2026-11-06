import { CardType, Players, RestrictionType, RestrictionScope, Trait } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot, doesNotBow } from '../../effects.js';
import { cardLastingEffect, ready } from '../../GameActions/GameActions.js';

export default class SacredSanctuary extends ProvinceCard {
    static id = 'sacred-sanctuary';

    override setupCardAbilities() {
        this.reaction('Choose a monk character')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Monk)
            }, ready(), cardLastingEffect({
                condition: () => this.game.isDuringConflict(),
                effect: doesNotBow()
            }), cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: RestrictionType.Bow,
                    appliesTo: RestrictionScope.OpponentsCardEffects,
                    applyingPlayer: context.player
                })
            })))
            .chatText('ready {0}, prevent opponents\' card effects from bowing it and stop it bowing at the end of the conflict');
    }
}
