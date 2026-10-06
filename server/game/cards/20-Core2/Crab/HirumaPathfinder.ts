import { CardType, Location, Players } from '../../../Constants.js';
import { lookAt, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class HirumaPathfinder extends DrawCard {
    static id = 'hiruma-pathfinder';

    setupCardAbilities() {
        this.reaction('Look at a province')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(selectCard({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Opponent,
                gameAction: lookAt((context) => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                }))
            }))
            .effect('look at a province');
    }
}
