import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class KitsukiKagi extends DrawCard {
    static id = 'kitsuki-kagi';

    override setupCardAbilities() {
        this.reaction('Remove cards from the game')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source)
            })
            .target({
                name: 'first',
                activePromptTitle: 'Choose up to 3 cards',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile]
            }, moveCard({ destination: Location.RemovedFromGame }))
            .target({
                name: 'second',
                activePromptTitle: 'Choose a card',
                dependsOn: 'first',
                optional: true,
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                cardCondition: (card, context) =>
                    card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first
            }, moveCard({ destination: Location.RemovedFromGame }))
            .target({
                name: 'third',
                activePromptTitle: 'Choose a card',
                dependsOn: 'first',
                optional: true,
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                cardCondition: (card, context) =>
                    card.controller === context.targets.first.controller &&
                        card.location === context.targets.first.location &&
                        card !== context.targets.first &&
                        card !== context.targets.second
            }, moveCard({ destination: Location.RemovedFromGame }))
            .chatText((context) => msg`remove ${[context.targets.first, context.targets.second, context.targets.third].flat().filter(Boolean)} from the game`);
    }
}


export default KitsukiKagi;
