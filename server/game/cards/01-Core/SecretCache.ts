import { Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SecretCache extends ProvinceCard {
    static id = 'secret-cache';

    setupCardAbilities() {
        this.reaction('Look at top 5 cards')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                amount: 5,
                reveal: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top 5 cards of their conflict deck');
    }
}
