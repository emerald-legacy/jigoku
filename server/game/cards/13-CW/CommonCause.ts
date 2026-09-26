import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CommonCause extends DrawCard {
    static id = 'common-cause';

    setupCardAbilities() {
        this.action('Ready character')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .target('target', {
                activePromptTitle: 'Choose a character to ready',
                cardType: CardType.Character
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready(),
                AbilityDsl.actions.honor((context) => ({ target: context.target.controller !== context.player ? context.target : [] }))
            ]));
    }
}


export default CommonCause;
