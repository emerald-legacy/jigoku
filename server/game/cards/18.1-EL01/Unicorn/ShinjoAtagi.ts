import { msg } from '../../../GameChat.js';
import { setMilitarySkill, setPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect, selectAttackedProvince } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoAtagi extends DrawCard {
    static id = 'shinjo-atagi';

    override setupCardAbilities() {
        this.conflictAction('Set a participating character\'s skills')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, selectAttackedProvince((context) => ({
                message: (context, card) => msg`${context.source} sets the ${context.game.currentConflict?.conflictType} skill of ${context.target} to ${card.getStrength()}${context.game.currentConflict?.conflictType}`,
                subActionProperties: (card) => {
                    const provinceStrength = card.getStrength();
                    const effect =
                            context.game.currentConflict?.conflictType === ConflictType.Military
                                ? setMilitarySkill(provinceStrength)
                                : setPoliticalSkill(provinceStrength);
                    return {
                        target: context.target,
                        effect: effect
                    };
                },
                gameAction: cardLastingEffect({})
            })))
            .chatText((context) => msg`set the ${context.game.currentConflict?.conflictType ?? ''} skill of ${context.chatTarget()} to the strength of an attacked province`);
    }
}
