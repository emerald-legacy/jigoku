import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class ByAnyMeans extends DrawCard {
    static id = 'by-any-means';

    setupCardAbilities() {
        this.action({
            title: 'Change base skill to match another character\'s',
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid,
            targets: {
                myCharacter: {
                    activePromptTitle: 'Choose a bushi character',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating() && card.hasTrait('bushi')
                },
                oppCharacter: {
                    dependsOn: 'myCharacter',
                    activePromptTitle: 'Choose an opponent\'s character',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                        let effects = [];
                        let oppCharacter = context.targets.oppCharacter;
                        if(oppCharacter.hasDash('military')) {
                            effects.push(AbilityDsl.effects.setBaseDash('military'));
                        } else {
                            effects.push(AbilityDsl.effects.setBaseMilitarySkill(oppCharacter.militarySkill));
                        }
                        return {
                            target: context.targets.myCharacter,
                            effect: effects
                        };
                    })
                }
            },
            effect: 'set {1}\'s base military skill to equal {2}\'s current military skill',
            effectArgs: context => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }
}


export default ByAnyMeans;
