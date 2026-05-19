import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class WarDogMaster extends DrawCard {
    static id = 'war-dog-master';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source)
            },
            cost: AbilityDsl.costs.discardCardSpecific(context => context.player.dynastyDeck[0]),
            effect: 'give {0} +{1}{2}',
            effectArgs: context => [context.costs.discardCard && typeof context.costs.discardCard[0].getCost() === 'number' ? context.costs.discardCard[0].getCost() : 0, 'military'],
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.modifyMilitarySkill(
                    context.costs.discardCard && typeof context.costs.discardCard[0].getCost() === 'number' ? context.costs.discardCard[0].getCost() : 0
                )
            }))
        });
    }
}


export default WarDogMaster;
