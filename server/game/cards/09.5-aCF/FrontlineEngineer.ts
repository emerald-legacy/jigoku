import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, DeckType } from '../../Constants.js';
import { modifyGlory } from '../../effects.js';
import { deckSearch, placeInProvince } from '../../GameActions/GameActions.js';

class FrontlineEngineer extends DrawCard {
    static id = 'frontline-engineer';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory(() => this.getHoldingsInPlay())
        });

        this.action('Place a holding from your deck faceup in the defending province')
            .condition((context) => context.player.dynastyDeck.length > 0 && context.source.isDefending())
            .selectAttackedProvince({
                gameAction: (province) => deckSearch((context) => ({
                    target: context.player,
                    activePromptTitle: 'Choose a holding',
                    cardsToLookAt: 5,
                    deck: DeckType.Dynasty,
                    cardCondition: (card) => card.type === CardType.Holding,
                    message: (context, [card]) =>
                        msg`${context.player} discards ${context.player.getDynastyCardsInProvince(province.location)}, replacing it with ${card}`,
                    gameAction: placeInProvince({ destination: province.location, discard: 'all' })
                }))
            })
            .chatText('look at the top five cards of their dynasty deck');
    }

    getHoldingsInPlay() {
        return this.game.allCards.reduce((sum, card) => {
            if(card.isFaceup() && (card.isInProvince() && card.type === CardType.Holding)) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}


export default FrontlineEngineer;
