import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';

class Spyglass extends DrawCard {
    static id = 'spyglass';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onConflictDeclared: (event, context) => (event.attackers ?? []).some((card) => card === context.source.parentCharacter),
                onDefendersDeclared: (event, context) => event.defenders.some((card) => card === context.source.parentCharacter),
                onMoveToConflict: (event, context) => event.card === context.source.parentCharacter
            })
            .draw()
            .limit(perRound(2));
    }
}


export default Spyglass;
