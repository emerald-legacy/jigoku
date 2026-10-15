import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { takeControl } from '../../effects.js';
import { cardLastingEffect, loseHonor, multiple } from '../../GameActions/GameActions.js';

class SeizeTheMind extends DrawCard {
    static id = 'seize-the-mind';

    setupCardAbilities() {
        this.conflictAction('Take control of a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isUnique()
            }, multiple([
                loseHonor((context) => ({
                    target: context.player,
                    amount: context.target?.getFate() ?? 0
                })),
                cardLastingEffect((context) => ({
                    effect: takeControl(context.player)
                }))
            ]))
            .chatText((context) => {
                const fate = context.target.getFate();
                return fate > 0
                    ? msg`take control of ${context.chatTarget()} and lose ${fate}${' honor'}`
                    : msg`take control of ${context.chatTarget()}`;
            });
    }

    isTemptationsMaho() {
        return true;
    }
}


export default SeizeTheMind;
