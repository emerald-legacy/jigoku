import DrawCard from '../../drawcard';
import { Locations, Players, CardTypes } from '../../Constants';

class MyAncestorsStrength extends DrawCard {
    static id = 'my-ancestor-s-strength';

    setupCardAbilities(ability) {
        this.action({
            title: 'Modify base military and political skills',

            targets: {
                shugenja: {
                    activePromptTitle: 'Choose a shugenja character',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('shugenja') && card.isParticipating()
                },
                ancestor: {
                    dependsOn: 'shugenja',
                    activePromptTitle: 'Choose a character to copy from',
                    cardType: CardTypes.Character,
                    location: Locations.DynastyDiscardPile,
                    controller: Players.Self,
                    gameAction: ability.actions.cardLastingEffect(context => {
                        let effects = [];
                        let ancestor = context.targets.ancestor;
                        if(ancestor.hasDash('military')) {
                            effects.push(ability.effects.setBaseDash('military'));
                        } else {
                            effects.push(ability.effects.setBaseMilitarySkill(ancestor.militarySkill));
                        }
                        if(ancestor.hasDash('political')) {
                            effects.push(ability.effects.setBaseDash('political'));
                        } else {
                            effects.push(ability.effects.setBasePoliticalSkill(ancestor.politicalSkill));
                        }
                        return {
                            target: context.targets.shugenja,
                            effect: effects
                        };
                    })
                }
            },
            effect: 'set {1}\'s base skills to those of {2}',
            effectArgs: context => [context.targets.shugenja, context.targets.ancestor]
        });
    }
}


export default MyAncestorsStrength;
