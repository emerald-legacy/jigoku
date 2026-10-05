import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players, TargetMode } from '../../../Constants.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import DrawCard from '../../../DrawCard.js';

export default class CounselFromYumeDo extends DrawCard {
    static id = 'counsel-from-yume-do';

    public setupCardAbilities() {
        this.action('Shuffle cards back into your deck')
            .condition((context) => controlsShugenja(context.player))
            .targetCards({
                mode: TargetMode.UpTo,
                activePromptTitle: 'Choose up to 3 conflict cards',
                numCards: 3,
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                controller: Players.Self
            }, AbilityDsl.actions.returnToDeck({ location: Location.ConflictDiscardPile, shuffle: true }))
            .then((context) => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'water',
                    effect: 'draw a card',
                    gameAction: AbilityDsl.actions.draw({
                        target: context.player
                    })
                })
            }));
    }
}
