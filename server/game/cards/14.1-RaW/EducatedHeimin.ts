import { customRefillProvince } from '../../effects.js';
import { Location } from '../../Constants.js';
import { ProvinceAttachment } from '../ProvinceAttachment.js';

class EducatedHeimin extends ProvinceAttachment {
    static id = 'educated-heimin';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            condition: (context) => !!context?.source.parent,
            targetLocation: Location.Provinces,
            match: (card, context) => !!context && card === context.source.parent,
            effect: customRefillProvince((player, province) => {
                const cards = player.dynastyDeck.slice(0, province.isFacedown() ? 4 : 2);
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'Choose a card to refill the province with',
                    cards: cards,
                    cardHandler: (cardFromDeck) => {
                        player.moveCard(cardFromDeck, province.location);
                        cardFromDeck.facedown = true;
                        const discarded = cards.filter((card) => card !== cardFromDeck);
                        discarded.forEach((card) => {
                            player.moveCard(card, Location.DynastyDiscardPile);
                        });
                        this.game.addMessage('{0} chooses a card to put into {1} and discards {2} from the constant effect of Educated Heimin', player, province.isFacedown() ? 'a facedown province' : province.name, discarded);
                    }
                });
            })
        });
    }

    protected controllerProvinceOnly(): boolean {
        return true;
    }
}


export default EducatedHeimin;
