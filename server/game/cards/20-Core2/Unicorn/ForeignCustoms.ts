import { msg } from '../../../GameChat.js';
import { CardType, CharacterStatus, Location, Players } from '../../../Constants.js';
import { putIntoConflict, ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ForeignCustoms extends DrawCard {
    static id = 'foreign-customs';

    setupCardAbilities() {
        this.duelStrike('Put a character into play', (duel, context) => duel.loserController === context.player)
            .selectCard({
                activePromptTitle: 'Choose a character',
                hidePromptIfSingleCard: true,
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                message: (context, cards) => msg`${context.player} puts into the conflict ${cards} - they challenge the traditions of the empire`,
                gameAction: putIntoConflict({ status: CharacterStatus.Dishonored })
            });

        this.action('Ready a non-unicorn character')
            .condition((context) =>
                context.player.stronghold?.isFaction('unicorn') ||
                context.player.cardsInPlay.some(
                    (card) =>
                        card.isFaction('unicorn') ||
                        card.attachments.some((a) => a.isFaction('unicorn'))
                ))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAtHome() && (!card.isFaction('unicorn') || card.hasTrait('gaijin'))
            }, ready());
    }
}
