import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoAltansarnai extends DrawCard {
    static id = 'shinjo-altansarnai';

    setupCardAbilities() {
        this.reaction('Discard a character')
            .when({
                onBreakProvince: (event, context) => event.conflict?.conflictType === 'military' && context.source.isAttacking()
            })
            .target('target', {
                activePromptTitle: 'Choose a character to discard',
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent
            }, AbilityDsl.actions.discardFromPlay());
    }
}


export default ShinjoAltansarnai;
