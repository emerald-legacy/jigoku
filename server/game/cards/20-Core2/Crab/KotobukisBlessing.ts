import { CardType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class KotobukisBlessing extends DrawCard {
    static id = 'kotobuki-s-blessing';

    setupCardAbilities() {
        this.action({
            title: 'Place a fate on a character',
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.placeFate({ amount: 1 }),
                    AbilityDsl.actions.selectCard((context) => ({
                        mode: TargetMode.UpTo,
                        numCards: 1,
                        cardType: CardType.Attachment,
                        controller: Players.Any,
                        cardCondition: (card) => card.parent === context.target,
                        activePromptTitle: 'Choose up to 1 attachment',
                        optional: true,
                        gameAction: AbilityDsl.actions.discardFromPlay(),
                        message: '{0} chooses to discard {1} from {2}',
                        messageArgs: (cards: DrawCard[]) => [
                            context.player,
                            cards.length === 0 ? 'no attachments' : cards,
                            context.target
                        ]
                    }))
                ])
            },
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
