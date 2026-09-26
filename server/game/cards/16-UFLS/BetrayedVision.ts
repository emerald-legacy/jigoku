import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class BetrayedVision extends DrawCard {
    static id = 'betrayed-vision';

    setupCardAbilities() {
        this.action('Make a character a copy')
            .target('cardToCopy', {
                activePromptTitle: 'Choose a character to copy',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => !card.isUnique()
            })
            .target('myCharacter', {
                dependsOn: 'cardToCopy',
                activePromptTitle: 'Choose a character to turn into the copy',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card !== context.targets.cardToCopy
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.copyCard(context.targets.cardToCopy)
            })))
            .effect('make {1} into a copy of {2}', (context) => [context.targets.myCharacter, context.targets.cardToCopy]);
    }

    canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card) => card.getType() === CardType.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
