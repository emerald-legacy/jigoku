import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TwentyFourSteps extends DrawCard {
    static id = 'twenty-four-steps';

    public setupCardAbilities() {
        this.action({
            title: 'Ready a character and move it to the conflict',
            condition: (context) => context.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi') && card.attachments.length >= 2,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.ready(),
                    AbilityDsl.actions.moveToConflict()
                ])
            },
            effect: 'ready {0} and move it into the conflict'
        });

        this.action({
            title: 'Move two monks to the conflict',
            condition: (context) => context.game.isDuringConflict('military'),
            target: {
                mode: TargetModes.UpTo,
                activePromptTitle: 'Choose characters',
                numCards: 2,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}
