import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, Players, CardTypes, Elements } from '../../Constants.js';

const elementKey = 'serene-seer-void';

class SereneSeer extends DrawCard {
    static id = 'serene-seer';

    setupCardAbilities() {
        this.action({
            title: 'Look at a province',
            condition: context => this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player.opponent),
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

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Void
        });
        return symbols;
    }
}


export default SereneSeer;

