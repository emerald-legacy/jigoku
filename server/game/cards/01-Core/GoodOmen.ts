import { placeFate } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class GoodOmen extends DrawCard {
    static id = 'good-omen';

    setupCardAbilities() {
        this.action('Add a fate to a character')
            .target({
                cardType: CardType.Character,
                cardCondition: card => (card.getCost() ?? 0) > 2
            }, placeFate());
    }

    canPlay(context: AbilityContext, playType: string): boolean {
        if(context.player.opponent && context.player.showBid < context.player.opponent.showBid) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default GoodOmen;
