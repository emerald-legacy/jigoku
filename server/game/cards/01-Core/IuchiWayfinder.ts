import DrawCard from '../../DrawCard.js';
import { lookAt } from '../../GameActions/GameActions.js';
import { Location, Players, CardType } from '../../Constants.js';
import { lookAtProvincesMessage } from '../lookAtProvincesMessage.js';

class IuchiWayfinder extends DrawCard {
    static id = 'iuchi-wayfinder';

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


export default IuchiWayfinder;
