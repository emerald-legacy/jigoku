import { CardType } from '../../../Constants.js';
import { applyStatusTokensToDuel } from '../../../effects.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShowMeYourStance extends DrawCard {
    static id = 'show-me-your-stance';

    setupCardAbilities() {
        this.duelChallenge('Apply status tokens to the duel')
            .duelLastingEffect({
                effect: applyStatusTokensToDuel()
            })
            .chatText('have status tokens count when resolving this duel');

        this.action('Send a character home')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isAttacking() &&
                    (context.game.currentConflict
                        ?.getCharacters(context.player)
                        .some((myCard) => myCard.hasTrait('duelist') && myCard.glory >= card.glory) ?? false)
            }, sendHome());
    }
}
