import DrawCard from '../../../drawcard.js';
import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class NoBreathWasted extends DrawCard {
    static id = 'no-breath-wasted';

    setupCardAbilities() {
        this.action({
            title: 'Ready character',
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            target: {
                activePromptTitle: 'Choose a character to ready',
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.honor(context => ({ target: context.target.controller !== context.player ? context.target : [] }))
                ])
            }
        });
    }
}


export default NoBreathWasted;
