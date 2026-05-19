import DrawCard from '../../drawcard.js';

class MaraudingOni extends DrawCard {
    static id = 'marauding-oni';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.cardCannot('honor'),
                ability.effects.cardCannot('dishonor')
            ]
        });

        this.forcedReaction({
            title: 'Lose honor when declared as attacker or defender',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source)
            },
            effect: 'lose an honor',
            gameAction: ability.actions.loseHonor(context => ({ target: context.player })),
            limit: ability.limit.unlimitedPerConflict()
        });
    }
}


export default MaraudingOni;
