import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Decks, Locations, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

export default class AsahinaEnvoy extends DrawCard {
    static id = 'asahina-envoy';

    setupCardAbilities() {
        this.interrupt<ProvinceCard>({
            title: 'Put a character into a province',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== Locations.StrongholdProvince,
                gameAction: AbilityDsl.actions.deckSearch<ProvinceCard>({
                    cardCondition: (card) =>
                        card.type === CardTypes.Character && (card.printedCost ?? 0) >= 4 && card.isFaction('crane'),
                    amount: 6,
                    deck: Decks.DynastyDeck,
                    shuffle: true,
                    selectedCardsHandler: (context, event, cards) => {
                        if(cards.length === 0) {
                            return this.game.addMessage('{0} selects no characters', event.player);
                        }

                        const target = context.target;
                        this.game.addMessage(
                            '{0} selects {1} and puts it into {2}',
                            event.player,
                            cards,
                            target?.facedown ? target.location : (target ?? '')
                        );

                        for(const card of cards) {
                            if(target) {
                                event.player.moveCard(card, target.location);
                            }
                            card.facedown = false;
                        }
                    }
                })
            },
            effect: 'put a character from their deck into a province'
        });
    }
}
