import { CardType, Duration } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { LastingEffectProperties } from '../../../GameActions/LastingEffectAction.js';

export default class ShowMeYourStance extends DrawCard {
    static id = 'show-me-your-stance';

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Apply status tokens to the duel',
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as TriggeredAbilityContext).event.duel,
                effect: AbilityDsl.effects.applyStatusTokensToDuel(),
                duration: Duration.UntilEndOfDuel
            } as LastingEffectProperties)),
            effect: 'have status tokens count when resolving this duel'
        });

        this.action({
            title: 'Send a character home',
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isAttacking() &&
                    (context.game.currentConflict
                        ?.getCharacters(context.player)
                        .some((myCard: DrawCard) => myCard.hasTrait('duelist') && myCard.glory >= card.glory) ?? false),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
