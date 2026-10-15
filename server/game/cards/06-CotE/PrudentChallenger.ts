import { msg } from '../../GameChat.js';
import { CardType, DuelType } from '../../Constants.js';
import { discardFromPlay, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class PrudentChallenger extends DrawCard {
    static id = 'prudent-challenger';

    setupCardAbilities() {
        this.action('Initiate a duel to discard attachment')
            .initiateDuel(() => ({
                type: DuelType.Military,
                chatText: (_context, duel) => msg`${duel.winnerController} chooses one of ${duel.loser}'s attachments to discard`,
                gameAction: (duel) =>
                    selectCard({
                        activePromptTitle: 'Choose an attachment to discard',
                        cardType: CardType.Attachment,
                        cardCondition: (card) => !!card.parentCharacter && (duel.loser?.includes(card.parentCharacter) ?? false),
                        targets: true,
                        message: (_context, card, player) => msg`${player} chooses to discard ${card}`,
                        gameAction: discardFromPlay()
                    })
            }));
    }
}
