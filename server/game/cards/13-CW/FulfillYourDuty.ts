import DrawCard from '../../drawcard.js';
import { CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FulfillYourDuty extends DrawCard {
    static id = 'fulfill-your-duty';

    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            effect: 'add {1} to an attacked province\'s strength',
            effectArgs: context => context.costs.sacrificeStateWhenChosen ? (context.costs.sacrificeStateWhenChosen as DrawCard).getMilitarySkill() : 0,
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} increases the strength of {1}',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(context.costs.sacrificeStateWhenChosen ? context.costs.sacrificeStateWhenChosen.getMilitarySkill() : 0)
                }))
            }))
        });
    }
}


export default FulfillYourDuty;
