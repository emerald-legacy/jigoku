import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';
import { joint, moveToConflict, sendHome } from '../../GameActions/GameActions.js';

class AkodoReserveCompany extends DrawCard {
    static id = 'akodo-reserve-company';

    override setupCardAbilities() {
        this.action('Bow an attacking character')
            .condition((context) => context.game.isTraitInPlay(Trait.Battlefield))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player
            }, joint([
                moveToConflict((context) => ({ target: context.source })),
                sendHome()
            ]));
    }
}


export default AkodoReserveCompany;
