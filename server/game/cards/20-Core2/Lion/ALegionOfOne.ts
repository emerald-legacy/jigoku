import { CardType, Players, ConflictType } from '../../../Constants.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, removeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ALegionOfOne extends DrawCard {
    static id = 'a-legion-of-one';

    setupCardAbilities() {
        this.conflictAction('Give a solitary character +3/+0', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    this.game.currentConflict !== null &&
                    this.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1
            }, cardLastingEffect({
                effect: modifyMilitarySkill(3)
            }))
            .chatText('give {0} +3/+0')
            .mayResolveAgain({ cost: removeFate((context) => ({ target: context.target })), label: 'Remove 1 fate' });
    }
}
