import { setMilitarySkill, setPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoAtagi extends DrawCard {
    static id = 'shinjo-atagi';

    setupCardAbilities() {
        this.action('Set a participating character\'s skills')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                message: '{3} sets the {1} skill of {0} to {2}{1}',
                messageArgs: (card) => [
                    context.target,
                    context.game.currentConflict?.conflictType,
                    card.isProvinceCard() ? card.getStrength() : 0,
                    context.source
                ],
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
            .effect('set the {1} skill of {0} to the strength of an attacked province', (context) => [context.game.currentConflict?.conflictType ?? '']);
    }
}
