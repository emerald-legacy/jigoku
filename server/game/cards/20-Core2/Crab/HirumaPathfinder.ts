import { CardType, Location, Players } from '../../../Constants.js';
import { lookAt } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { lookAtProvincesMessage } from '../../lookAtProvincesMessage.js';

export default class HirumaPathfinder extends DrawCard {
    static id = 'hiruma-pathfinder';

    override setupCardAbilities() {
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
                    message: lookAtProvincesMessage
                })
            })
            .chatText('look at a province');
    }
}
