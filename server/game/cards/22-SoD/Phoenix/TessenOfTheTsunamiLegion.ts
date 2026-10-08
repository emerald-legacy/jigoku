import { addTrait, gainAbility, modifyMilitarySkill } from '../../../effects.js';
import {
    cardLastingEffect,
    conditional,
    moveToConflict,
    multiple,
    sendHome
} from '../../../GameActions/GameActions.js';
import { CardType, AbilityType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';


export default class TessenOfTheTsunamiLegion extends DrawCard {
    static id = 'tessen-of-the-tsunami-legion';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'shugenja'
        });

        this.whileAttached({
            effect: [
                addTrait('water'),
                gainAbility(AbilityType.Action, {
                    title: 'Give a character +2 and move them',
                    condition: (context) => context.game.isDuringConflict(),
                    printedAbility: false,
                    target: {
                        cardType: CardType.Character,
                        controller: Players.Self,
                        cardCondition: (card) => card.hasTrait('bushi'),
                        gameAction: multiple([
                            cardLastingEffect({
                                effect: modifyMilitarySkill(2)
                            }),
                            conditional({
                                condition: (context) => context.source.isDrawCard() && context.source.isParticipating(),
                                trueGameAction: moveToConflict(),
                                falseGameAction: sendHome()
                            })
                        ])
                    },
                    chatText: 'give {0} +2{1}{2}',
                    chatTextArgs: (context) => ['military',
                        context.source.isParticipating() === (!!context.target?.isDrawCard() && context.target.isParticipating()) ? '' :
                            context.source.isParticipating() ? ' and move it to the conflict' : ' and move it home']
                })
            ]
        });
    }
}
