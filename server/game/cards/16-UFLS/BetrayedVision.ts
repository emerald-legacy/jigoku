import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class BetrayedVision extends DrawCard {
    static id = 'betrayed-vision';

    setupCardAbilities() {
        this.action({
            title: 'Make a character a copy',

            targets: {
                cardToCopy: {
                    activePromptTitle: 'Choose a character to copy',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card) => !card.isUnique()
                },
                myCharacter: {
                    dependsOn: 'cardToCopy',
                    activePromptTitle: 'Choose a character to turn into the copy',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card, context) => card.isParticipating() && card !== context.targets.cardToCopy,
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.copyCard(context.targets.cardToCopy)
                    }))
                }
            },
            effect: 'make {1} into a copy of {2}',
            effectArgs: (context) => [context.targets.myCharacter, context.targets.cardToCopy]
        });
    }

    canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
