import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SpecializedDefenses extends DrawCard {
    static id = 'specialized-defenses';

    setupCardAbilities() {
        this.action({
            title: 'Double province strength',
            condition: (context: any) => context.game.isDuringConflict(),
            effect: 'double the province strength of an attacked province',
            gameAction: AbilityDsl.actions.selectCard((context: any) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card: any) => card.isConflictProvince() && card.element.some((element: string) => {
                    if(element === 'all') {
                        return true;
                    }
                    return this.game.rings[element].isConsideredClaimed(context.player) ||
                           (this.game.currentConflict?.ring?.getElements().includes(element as any) ?? false);
                }),
                message: '{0} doubles the province strength of {1}',
                messageArgs: (cards: any) => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrengthMultiplier(2)
                }))
            }))
        });
    }
}


export default SpecializedDefenses;
