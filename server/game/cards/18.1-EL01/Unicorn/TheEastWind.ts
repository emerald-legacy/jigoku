import { Location } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { gainFate, moveCard } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';

export default class TheEastWind extends StrongholdCard {
    static id = 'the-east-wind';

    setupCardAbilities() {
        this.reaction('Place fate on character')
            .when({
                onCardPlayed: (event, context) =>
                    event.player === context.player && (event.card.hasTrait('gaijin') || this.isOutOfClan(event.card))
            })
            .cost(AbilityDsl.costs.bowSelf())
            .deckSearch((context) => {
                const playedCardTraits = context.event.card.getTraits();
                return {
                    amount: 5,
                    cardCondition: (card) => {
                        for(const searchedCardTrait of card.getTraits()) {
                            if(playedCardTraits.has(searchedCardTrait)) {
                                return true;
                            }
                        }
                        return false;
                    },
                    gameAction: moveCard({ destination: Location.Hand }),
                    takesNothingGameAction: gainFate()
                };
            });
    }

    private isOutOfClan(card: BaseCard): boolean {
        return !card.isFaction('neutral') && !card.isFaction('unicorn');
    }
}
