import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class EducatedHeimin extends DrawCard {
    static id = 'educated-heimin';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            condition: context => !!context?.source.parent,
            targetLocation: Locations.Provinces,
            match: (card, context) => !!context && card === context.source.parent,
            effect: AbilityDsl.effects.customRefillProvince((player: any, province: any) => {
                let cards = [];
                if(province.isFacedown()) {
                    cards = player.dynastyDeck.slice(0, 4);
                } else {
                    cards = player.dynastyDeck.slice(0, 2);
                }

                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'Choose a card to refill the province with',
                    cards: cards,
                    cardHandler: (cardFromDeck: any) => {
                        let provinceLocation = province.location;
                        player.moveCard(cardFromDeck, provinceLocation);
                        cardFromDeck.facedown = true;
                        cards.splice(cards.indexOf(cardFromDeck), 1);
                        cards.forEach((card: any) => {
                            player.moveCard(card, Locations.DynastyDiscardPile);
                        });
                        this.game.addMessage('{0} chooses a card to put into {1} and discards {2} from the constant effect of Educated Heimin', player, province.isFacedown() ? 'a facedown province' : province.name, cards);
                    }
                });
            })
        });
    }

    canPlayOn(source: any) {
        return source && source.getType() === 'province' && source.controller === this.controller && !source.isBroken && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent: any) {
        if(parent.type === CardTypes.Province && parent.isBroken) {
            return false;
        }

        if(parent.controller !== this.controller) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}


export default EducatedHeimin;
