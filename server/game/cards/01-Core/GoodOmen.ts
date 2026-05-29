import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';

class GoodOmen extends DrawCard {
    static id = 'good-omen';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Add a fate to a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.getCost() > 2,
                gameAction: ability.actions.placeFate()
            }
        });
    }

    canPlay(context: AbilityContext, playType: string): boolean {
        if(context.player.opponent && context.player.showBid < context.player.opponent.showBid) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default GoodOmen;
