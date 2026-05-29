import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, Players, CardTypes } from '../../Constants.js';

class IuchiWayfinder extends DrawCard {
    static id = 'iuchi-wayfinder';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at a province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'look at a province',
            gameAction: AbilityDsl.actions.selectCard({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                }))
            })
        });
    }
}


export default IuchiWayfinder;
