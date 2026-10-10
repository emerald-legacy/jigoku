import { CardType, DeckType, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { attach } from '../../../GameActions/GameActions.js';
import Soldier from '../../Soldier.js';
import { soldierAttachCheck } from '../../soldierAttachCheck.js';

export default class Pride extends StrongholdCard {
    static id = 'pride';

    setupCardAbilities() {
        const canAttachSoldier = soldierAttachCheck(this.controller);

        this.action('Give a character a +1/+1 attachment')
            .cost(costs.bowSelf())
            .condition((context) => context.player.conflictDeck.length > 0)
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.attachments.filter((a) => a.hasTrait('follower')).length === 0 &&
                    canAttachSoldier(card, context)
            })
            .tokenFromTopCard((context) => ({
                deck: DeckType.Conflict,
                token: Soldier,
                gameAction: (token) => attach({ target: context.target, attachment: token })
            }))
            .chatText('attach the top card of their conflict deck to {0} as a +1/+1 attachment');
    }
}
