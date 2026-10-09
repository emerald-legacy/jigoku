import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { RestrictionType } from '../../Constants.js';

class MaraudingOni extends DrawCard {
    static id = 'marauding-oni';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                cardCannot(RestrictionType.Honor),
                cardCannot(RestrictionType.Dishonor)
            ]
        });

        this.forcedReaction('Lose honor when declared as attacker or defender')
            .when({
                onConflictDeclared: (event, context) => (event.attackers ?? []).includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source)
            })
            .loseHonor((context) => ({ target: context.player }))
            .chatText('lose an honor')
            .limit(unlimitedPerConflict());
    }
}


export default MaraudingOni;
