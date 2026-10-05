import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SuperiorAuthority extends DrawCard {
    static id = 'superior-authority';

    setupCardAbilities() {
        this.action('Stop characters with 0 fate from contributing skill')
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.conflictLastingEffect(context => ({
                effect: AbilityDsl.effects.cannotContribute(() => {
                    return (card) => card.getFate() === 0 && card.checkRestrictions('', context);
                })
            })))
            .effect('make it so that participating characters with 0 fate cannot contribute skill to conflict resolution');
    }
}


export default SuperiorAuthority;
