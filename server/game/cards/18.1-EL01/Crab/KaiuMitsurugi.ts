import DrawCard from '../../../DrawCard.js';
import { Location, Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { addKeyword } from '../../../effects.js';
import { draw, gainFate, sequential } from '../../../GameActions/GameActions.js';

class KaiuMitsurugi extends DrawCard {
    static id = 'kaiu-mitsurugi';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Self,
            match: card => card.type === CardType.Holding,
            targetLocation: Location.Any,
            effect: addKeyword('rally')
        });

        this.action('Draw a card and gain a fate')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Holding
            }))
            .gameAction(sequential([
                gainFate(context => ({
                    target: context.player
                })),
                draw(context => ({
                    target: context.player
                }))
            ]))
            .effect('gain 1 fate and draw 1 card');
    }
}


export default KaiuMitsurugi;
