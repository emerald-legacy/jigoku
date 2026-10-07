import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import * as costs from '../../costs/index.js';
import { perRound } from '../../AbilityLimit.js';
import { sendHome } from '../../GameActions/GameActions.js';

export default class BrothersGiftDojo extends ProvinceCard {
    static id = 'brother-s-gift-dojo';

    setupCardAbilities() {
        this.action('Move a character home')
            .cost(costs.payHonor(1))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, sendHome())
            .limit(perRound(2))
            .conflictProvinceCondition(() => true);
    }
}
