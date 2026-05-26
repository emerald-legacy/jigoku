import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class IncessantMoto extends DrawCard {
    static id = 'incessant-moto';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: (card, context) => card === context?.source,
            effect: AbilityDsl.effects.canContributeWhileBowed()
        });

        this.reaction({
            title: 'Move to conflict',
            when: {
                onCardPlayed: (event, context) => event.card.type === CardTypes.Event && event.card.controller === context.player
            },
            gameAction: AbilityDsl.actions.moveToConflict(context => ({
                target: context.source
            }))
        });
    }
}
