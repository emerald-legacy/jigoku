import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
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
                    location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                    gameAction: AbilityDsl.actions.moveCard({ destination: Location.RemovedFromGame })
                },
                second: {
                    activePromptTitle: 'Choose a card',
                    dependsOn: 'first',
                    optional: true,
                    location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                    cardCondition: (card, context) =>
                        card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first,
                    gameAction: AbilityDsl.actions.moveCard({ destination: Location.RemovedFromGame })
                },
                third: {
                    activePromptTitle: 'Choose a card',
                    dependsOn: 'first',
                    optional: true,
                    location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                    cardCondition: (card, context) =>
                        card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first &&
                        card !== context.targets.second,
                    gameAction: AbilityDsl.actions.moveCard({ destination: Location.RemovedFromGame })
                }
            }
        });
    }
}


export default KitsukiKagi;
