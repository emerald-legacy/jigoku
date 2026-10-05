import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, Players, CardType } from '../../Constants.js';

class IuchiWayfinder extends DrawCard {
    static id = 'iuchi-wayfinder';

    setupCardAbilities() {
        this.reaction('Look at a province')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.selectCard({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                }))
            }))
            .effect('look at a province');
    }
}


export default IuchiWayfinder;
