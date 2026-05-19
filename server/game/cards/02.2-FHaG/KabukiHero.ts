import DrawCard from '../../drawcard.js';

class KabukiHero extends DrawCard {
    static id = 'kabuki-hero';

    setupCardAbilities(ability) {
        this.action({
            title: 'Gain military bonus',
            cost: ability.costs.payFate(1),
            condition: () => this.game.isDuringConflict(),
            effect: 'give itself +{1}{2}/+0{3} until the end of the conflict',
            effectArgs: context => [context.source.politicalSkill, 'military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                effect: ability.effects.modifyMilitarySkill(context.source.politicalSkill)
            }))
        });
    }
}


export default KabukiHero;
