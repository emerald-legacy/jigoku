import { CardType, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ShowMeYourStance extends DrawCard {
    static id = 'show-me-your-stance';

    setupCardAbilities() {
        this.duelChallenge('Apply status tokens to the duel')
            .gameAction(AbilityDsl.actions.duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: AbilityDsl.effects.applyStatusTokensToDuel(),
                duration: Duration.UntilEndOfDuel
            })))
            .effect('have status tokens count when resolving this duel');

        this.action('Send a character home')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isAttacking() &&
                    (context.game.currentConflict
                        ?.getCharacters(context.player)
                        .some((myCard: DrawCard) => myCard.hasTrait('duelist') && myCard.glory >= card.glory) ?? false)
            }, AbilityDsl.actions.sendHome());
    }
}
