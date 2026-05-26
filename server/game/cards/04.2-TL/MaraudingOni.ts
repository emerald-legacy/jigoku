import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class MaraudingOni extends DrawCard {
    static id = 'marauding-oni';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.cardCannot('honor'),
                AbilityDsl.effects.cardCannot('dishonor')
            ]
        });

        this.forcedReaction({
            title: 'Lose honor when declared as attacker or defender',
            when: {
                onConflictDeclared: (event: any, context: AbilityContext) => (event.attackers ?? []).includes(context.source),
                onDefendersDeclared: (event: any, context: AbilityContext) => (event.defenders ?? []).includes(context.source)
            },
            effect: 'lose an honor',
            gameAction: AbilityDsl.actions.loseHonor((context: AbilityContext) => ({ target: context.player })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}


export default MaraudingOni;
