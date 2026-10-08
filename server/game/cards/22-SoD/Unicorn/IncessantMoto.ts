import { CardType, Players } from '../../../Constants.js';
import { canContributeWhileBowed } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class IncessantMoto extends DrawCard {
    static id = 'incessant-moto';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Any,
            match: (card, context) => card === context?.source,
            effect: canContributeWhileBowed()
        });

        this.reaction('Move to conflict')
            .when({
                onCardPlayed: (event, context) => event.card.type === CardType.Event && event.card.controller === context.player
            })
            .moveToConflict();
    }
}
