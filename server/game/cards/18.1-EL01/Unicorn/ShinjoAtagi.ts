import { msg } from '../../../GameChat.js';
import { setMilitarySkill, setPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoAtagi extends DrawCard {
    static id = 'shinjo-atagi';

    setupCardAbilities() {
        this.conflictAction('Set a participating character\'s skills')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                message: (context, card) => msg`${context.source} sets the ${context.game.currentConflict?.conflictType} skill of ${context.target} to ${card.isProvinceCard() ? card.getStrength() : 0}${context.game.currentConflict?.conflictType}`,
                cardCondition: (card) => card.isConflictProvince(),
                subActionProperties: (card) => {
                    const provinceStrength = card.isProvinceCard() ? card.getStrength() : 0;
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
