import { CardType, DuelType } from '../../Constants.js';
import { discardFromPlay, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class PrudentChallenger extends DrawCard {
    static id = 'prudent-challenger';

    setupCardAbilities() {
        this.action('Initiate a duel to discard attachment')
            .initiateDuel(() => ({
                type: DuelType.Military,
                message: '{0} chooses one of {1}\'s attachments to discard',
                messageArgs: (duel) => [duel.winnerController, duel.loser],
                gameAction: (duel) =>
                    selectCard({
                        activePromptTitle: 'Choose an attachment to discard',
                        cardType: CardType.Attachment,
                        cardCondition: (card) => !!card.parentCharacter && (duel.loser?.includes(card.parentCharacter) ?? false),
                        targets: true,
                        message: '{0} chooses to discard {1}',
                        messageArgs: (card, player) => [player, card],
                        gameAction: discardFromPlay()
                    })
            }));
    }
}
