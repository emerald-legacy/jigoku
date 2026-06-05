import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';

class SuperiorAuthority extends DrawCard {
    static id = 'superior-authority';

    setupCardAbilities() {
        this.action({
            title: 'Stop characters with 0 fate from contributing skill',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.conflictLastingEffect(context => ({
                duration: Duration.UntilEndOfConflict,
                effect: AbilityDsl.effects.cannotContribute(() => {
                    return (card: BaseCard) => (card as DrawCard).getFate() === 0 && card.checkRestrictions('', context);
                })
            })),
            effect: 'make it so that participating characters with 0 fate cannot contribute skill to conflict resolution'
        });
    }
}


export default SuperiorAuthority;
