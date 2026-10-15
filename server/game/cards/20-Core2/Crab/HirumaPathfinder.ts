import { msg } from '../../../GameChat.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { lookAt } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class HirumaPathfinder extends DrawCard {
    static id = 'hiruma-pathfinder';

    setupCardAbilities() {
        this.reaction('Look at a province')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .selectCard({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Opponent,
                gameAction: lookAt({
                    message: (context, cards) => msg`${context.source} sees ${cards[0]} in ${cards[0].location}`
                })
            })
            .chatText('look at a province');
    }
}
