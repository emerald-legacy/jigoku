import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class BrothersGiftDojo extends ProvinceCard {
    static id = 'brother-s-gift-dojo';

    setupCardAbilities() {
        this.action('Move a character home')
            .cost(AbilityDsl.costs.payHonor(1))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.sendHome())
            .limit(AbilityDsl.limit.perRound(2))
            .conflictProvinceCondition(() => true);
    }
}
