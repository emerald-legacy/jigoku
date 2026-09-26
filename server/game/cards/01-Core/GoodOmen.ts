import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class GoodOmen extends DrawCard {
    static id = 'good-omen';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Add a fate to a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => (card.getCost() ?? 0) > 2
            }, ability.actions.placeFate());
    }

    canPlay(context: AbilityContext, playType: string): boolean {
        if(context.player.opponent && context.player.showBid < context.player.opponent.showBid) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default GoodOmen;
