import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class AkodoReserveCompany extends DrawCard {
    static id = 'akodo-reserve-company';

    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: context => context.game.isTraitInPlay('battlefield'),
            target: {
                cardType: CardTypes.Character,
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
