import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Defiance extends DrawCard {
    static id = 'defiance';

    setupCardAbilities() {
        this.action('Give a character a skill bonus')
            .condition(context => !!(context.game.isDuringConflict() && context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length))
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.modifyBothSkills(context.player.opponent?.showBid ?? 0)
            })))
            .effect('give {0} +{1}{2}/+{1}{3}', context => [context.player.opponent?.showBid ?? 0, 'military', 'political']);
    }
}


export default Defiance;
