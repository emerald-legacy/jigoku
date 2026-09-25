import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class JewelOfTheKhamasin extends DrawCard {
    static id = 'jewel-of-the-khamasin';

    setupCardAbilities() {
        this.action('Reduce province strength')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isAttacking()))
            .gameAction(AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card: BaseCard) => card.isConflictProvince() && (card as ProvinceCard).getStrength() > 0,
                message: '{0} reduces the strength of {1} by 1',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(-1)
                }))
            })))
            .effect('reduce an attacked province strength by 1')
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default JewelOfTheKhamasin;
