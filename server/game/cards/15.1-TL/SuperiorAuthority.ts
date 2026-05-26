import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Durations } from '../../Constants.js';

class SuperiorAuthority extends DrawCard {
    static id = 'superior-authority';

    setupCardAbilities() {
        this.action({
            title: 'Stop characters with 0 fate from contributing skill',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.conflictLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.cannotContribute(() => {
                    return (card: any) => card.getFate() === 0 && card.checkRestrictions('', context);
                })
            })),
            effect: 'make it so that participating characters with 0 fate cannot contribute skill to conflict resolution'
        });
    }
}


export default SuperiorAuthority;
