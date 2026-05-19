import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Defiance extends DrawCard {
    static id = 'defiance';

    setupCardAbilities() {
        this.action({
            title: 'Give a character a skill bonus',
            condition: context => context.game.isDuringConflict() && context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.modifyBothSkills(context.player.opponent.showBid)
                }))
            },
            effect: 'give {0} +{1}{2}/+{1}{3}',
            effectArgs: context => [context.player.opponent.showBid, 'military', 'political']
        });
    }
}


export default Defiance;
