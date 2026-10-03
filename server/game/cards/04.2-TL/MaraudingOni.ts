import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class MaraudingOni extends DrawCard {
    static id = 'marauding-oni';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.cardCannot('honor'),
                AbilityDsl.effects.cardCannot('dishonor')
            ]
        });

        this.forcedReaction('Lose honor when declared as attacker or defender')
            .when({
                onConflictDeclared: (event, context) => (event.attackers ?? []).includes(context.source),
                onDefendersDeclared: (event, context) => (event.defenders ?? []).includes(context.source)
            })
            .gameAction(AbilityDsl.actions.loseHonor((context) => ({ target: context.player })))
            .effect('lose an honor')
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default MaraudingOni;
