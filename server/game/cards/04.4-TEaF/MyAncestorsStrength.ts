import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations, Players, CardTypes } from '../../Constants.js';

class MyAncestorsStrength extends DrawCard {
    static id = 'my-ancestor-s-strength';

    setupCardAbilities() {
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
                    gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                        let effects = [];
                        let ancestor = context.targets.ancestor;
                        if(ancestor.hasDash('military')) {
                            effects.push(AbilityDsl.effects.setBaseDash('military'));
                        } else {
                            effects.push(AbilityDsl.effects.setBaseMilitarySkill(ancestor.militarySkill));
                        }
                        if(ancestor.hasDash('political')) {
                            effects.push(AbilityDsl.effects.setBaseDash('political'));
                        } else {
                            effects.push(AbilityDsl.effects.setBasePoliticalSkill(ancestor.politicalSkill));
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
