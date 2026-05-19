import { CardTypes, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class BrothersGiftDojo extends ProvinceCard {
    static id = 'brother-s-gift-dojo';

    setupCardAbilities() {
        this.action({
            title: 'Move a character home',
            limit: AbilityDsl.limit.perRound(2),
            conflictProvinceCondition: () => true,
            cost: AbilityDsl.costs.payHonor(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
