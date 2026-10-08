import { CardType, ConflictType, Players } from '../../../Constants.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TheVoidOfWar extends DrawCard {
    static id = 'the-void-of-war';

    setupCardAbilities() {
        this.conflictAction('Each player bows an opponent character until refused', { conflictType: ConflictType.Military })
            .target({
                controller: Players.Opponent,
                player: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, bow())
            .chatText('bow {0}')
            .opponentMayResolveAgain('Resolve The Void of War\'s ability again?');
    }
}
