import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot, doesNotBow } from '../../effects.js';
import { cardLastingEffect, ready } from '../../GameActions/GameActions.js';

export default class SacredSanctuary extends ProvinceCard {
    static id = 'sacred-sanctuary';

    setupCardAbilities() {
        this.reaction('Choose a monk character')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('monk')
            }, ready(), cardLastingEffect({
                condition: () => this.game.isDuringConflict(),
                effect: doesNotBow()
            }), cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .chatText('prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict');
    }
}
