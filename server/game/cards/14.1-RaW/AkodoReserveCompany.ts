import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AkodoReserveCompany extends DrawCard {
    static id = 'akodo-reserve-company';

    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: context => context.game.isTraitInPlay('battlefield'),
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player,
                gameAction: AbilityDsl.actions.joint([
                    AbilityDsl.actions.moveToConflict(context => ({ target: context.source })),
                    AbilityDsl.actions.sendHome()
                ])
            }
        });
    }
}


export default AkodoReserveCompany;
