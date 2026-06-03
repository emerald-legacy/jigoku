import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class CounselFromYumeDo extends DrawCard {
    static id = 'counsel-from-yume-do';

    public setupCardAbilities() {
        this.action({
            title: 'Shuffle cards back into your deck',
            condition: (context) =>
                (context.player.cardsInPlay as Array<DrawCard>).some(
                    (card) => card.getType() === CardType.Character && card.hasTrait('shugenja')
                ),
            target: {
                mode: TargetMode.UpTo,
                activePromptTitle: 'Choose up to 3 conflict cards',
                numCards: 3,
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                controller: Players.Self,
                gameAction: AbilityDsl.actions.returnToDeck({ location: Location.ConflictDiscardPile, shuffle: true })
            },
            then: (context: AbilityContext) => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'water',
                    effect: 'draw a card',
                    gameAction: AbilityDsl.actions.draw({
                        target: context.player
                    })
                })
            })
        });
    }
}
