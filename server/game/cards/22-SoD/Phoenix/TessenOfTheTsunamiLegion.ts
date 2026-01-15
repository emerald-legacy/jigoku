import AbilityDsl from '../../../abilitydsl';
import { CardTypes, AbilityTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';


export default class TessenOfTheTsunamiLegion extends DrawCard {
    static id = 'tessen-of-the-tsunami-legion';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'shugenja'
        });

        this.whileAttached({
            effect: [
                AbilityDsl.effects.addTrait('water'),
                AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                    title: 'Give a character +2 and move them',
                    condition: context => context.game.isDuringConflict(),
                    printedAbility: false,
                    target: {
                        cardType: CardTypes.Character,
                        controller: Players.Self,
                        cardCondition: (card, context) => card.hasTrait('bushi'),
                        gameAction: AbilityDsl.actions.multiple([
                            AbilityDsl.actions.cardLastingEffect(context => ({
                                effect: AbilityDsl.effects.modifyMilitarySkill(2)
                            })),
                            AbilityDsl.actions.conditional({
                                condition: context => context.source.isParticipating(),
                                trueGameAction: AbilityDsl.actions.moveToConflict(),
                                falseGameAction: AbilityDsl.actions.sendHome()
                            })
                        ])
                    },
                    effect: 'give {0} +2{1}{2}',
                    effectArgs: context => ['military',
                        context.source.isParticipating() === context.target.isParticipating() ? '' :
                            context.source.isParticipating() ? ' and move it to the conflict' : ' and move it home']
                })
            ]
        });
    }
}
