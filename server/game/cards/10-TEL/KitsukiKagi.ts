import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KitsukiKagi extends DrawCard {
    static id = 'kitsuki-kagi';

    setupCardAbilities() {
        this.reaction({
            title: 'Remove cards from the game',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            targets: {
                first: {
                    activePromptTitle: 'Choose up to 3 cards',
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    gameAction: AbilityDsl.actions.moveCard({ destination: Locations.RemovedFromGame })
                },
                second: {
                    activePromptTitle: 'Choose a card',
                    dependsOn: 'first',
                    optional: true,
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    cardCondition: (card, context) =>
                        card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first,
                    gameAction: AbilityDsl.actions.moveCard({ destination: Locations.RemovedFromGame })
                },
                third: {
                    activePromptTitle: 'Choose a card',
                    dependsOn: 'first',
                    optional: true,
                    location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                    cardCondition: (card, context) =>
                        card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first &&
                        card !== context.targets.second,
                    gameAction: AbilityDsl.actions.moveCard({ destination: Locations.RemovedFromGame })
                }
            }
        });
    }
}


export default KitsukiKagi;
