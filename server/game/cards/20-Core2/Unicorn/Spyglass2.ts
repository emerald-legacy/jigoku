import { gainAbility } from '../../../effects.js';
import { draw } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class Spyglass2 extends DrawCard {
    static id = 'spyglass-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Draw a card', {
                onConflictDeclared: (event, context) => (event.attackers ?? []).includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source),
                onMoveToConflict: (event, context) => event.card === context.source
            }, (ability) => ability.gameAction(draw()))
        });
    }
}
