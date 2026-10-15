import DrawCard from '../../DrawCard.js';
import { CardType, Players, ConflictType } from '../../Constants.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class ShinjoAltansarnai extends DrawCard {
    static id = 'shinjo-altansarnai';

    setupCardAbilities() {
        this.reaction('Discard a character')
            .when({
                onBreakProvince: (event, context) => event.conflict?.conflictType === ConflictType.Military && context.source.isAttacking()
            })
            .target({
                activePromptTitle: 'Choose a character to discard',
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent
            }, discardFromPlay());
    }
}


export default ShinjoAltansarnai;
