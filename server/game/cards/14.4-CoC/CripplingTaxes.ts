import DrawCard from '../../DrawCard.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { Location, CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class CripplingTaxes extends DrawCard {
    static id = 'crippling-taxes';

    setupCardAbilities() {
        this.action('Discard all cards in a province')
            .target({
                location: Location.Provinces,
                cardType: CardType.Province
            })
            .gameAction(moveCard((context) => ({
                destination: Location.DynastyDiscardPile,
                target: context.target?.controller.getDynastyCardsInProvince(context.target.location)
            })))
            .chatText((context) => msg`discard ${context.target.controller.getDynastyCardsInProvince(context.target.location)}`);
    }
}


export default CripplingTaxes;
