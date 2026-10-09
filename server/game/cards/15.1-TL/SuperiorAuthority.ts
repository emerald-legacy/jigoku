import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';
import { conflictLastingEffect } from '../../GameActions/GameActions.js';

class SuperiorAuthority extends DrawCard {
    static id = 'superior-authority';

    setupCardAbilities() {
        this.conflictAction('Stop characters with 0 fate from contributing skill')
            .gameAction(conflictLastingEffect((context) => ({
                effect: cannotContribute(() => {
                    return (card) => card.getFate() === 0 && card.checkRestrictions(undefined, context);
                })
            })))
            .chatText('make it so that participating characters with 0 fate cannot contribute skill to conflict resolution');
    }
}


export default SuperiorAuthority;
