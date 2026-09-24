import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import type Player from '../../Player.js';
import type Ring from '../../Ring.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

class EducatedHeimin extends DrawCard {
    static id = 'educated-heimin';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            condition: context => !!context?.source.parent,
            targetLocation: Location.Provinces,
            match: (card, context) => !!context && card === context.source.parent,
            effect: AbilityDsl.effects.customRefillProvince((player: Player, province: ProvinceCard) => {
                let cards: DrawCard[] = [];
                if(province.isFacedown()) {
                    cards = player.dynastyDeck.slice(0, 4);
                } else {
                    cards = player.dynastyDeck.slice(0, 2);
                }

                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'Choose a card to refill the province with',
                    cards: cards,
                    cardHandler: (cardFromDeck: DrawCard) => {
                        let provinceLocation = province.location;
                        player.moveCard(cardFromDeck, provinceLocation);
                        cardFromDeck.facedown = true;
                        cards.splice(cards.indexOf(cardFromDeck), 1);
                        cards.forEach((card: DrawCard) => {
                            player.moveCard(card, Location.DynastyDiscardPile);
                        });
                        this.game.addMessage('{0} chooses a card to put into {1} and discards {2} from the constant effect of Educated Heimin', player, province.isFacedown() ? 'a facedown province' : province.name, cards);
                    }
                });
            })
        });
    }

    canPlayOn(source: BaseCard | Ring) {
        return source instanceof BaseCard && source.getType() === 'province' && source.controller === this.controller && !(source as ProvinceCard).isBroken && this.getType() === CardType.Attachment;
    }

    canAttach(parent?: BaseCard | Ring) {
        if(!(parent instanceof BaseCard)) {
            return false;
        }

        if(parent.type === CardType.Province && (parent as ProvinceCard).isBroken) {
            return false;
        }

        if(parent.controller !== this.controller) {
            return false;
        }

        return parent.getType() === CardType.Province && this.getType() === CardType.Attachment;
    }
}


export default EducatedHeimin;
