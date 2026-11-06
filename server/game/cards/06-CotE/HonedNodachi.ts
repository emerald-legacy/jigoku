import * as costs from '../../costs/index.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players, ConflictType, Trait } from '../../Constants.js';

class HonedNodachi extends DrawCard {
    static id = 'honed-nodachi';

    override setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Bushi
        });

        this.reaction('Remove a fate from attached character and force opponent to discard a participating character')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter && event.conflict.isOnWinningSide(context.source.parentCharacter) &&
                                                   event.conflict.conflictType === ConflictType.Military
            })
            .cost(costs.removeFateFromParent())
            .target({
                activePromptTitle: 'Choose a character to discard',
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, discardFromPlay());
    }
}


export default HonedNodachi;
