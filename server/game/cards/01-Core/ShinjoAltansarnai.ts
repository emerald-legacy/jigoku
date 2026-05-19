import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class ShinjoAltansarnai extends DrawCard {
    static id = 'shinjo-altansarnai';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Discard a character',
            when: {
                onBreakProvince: (event, context) => event.conflict.conflictType === 'military' && context.source.isAttacking()
            },
            target: {
                activePromptTitle: 'Choose a character to discard',
                cardType: CardTypes.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}


export default ShinjoAltansarnai;
