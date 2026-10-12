import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, DeckType } from '../../Constants.js';
import { modifyGlory } from '../../effects.js';
import { deckSearch, handler, placeInProvince } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { GameActionTarget } from '../../GameActions/GameAction.js';

class FrontlineEngineer extends DrawCard {
    static id = 'frontline-engineer';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory(() => this.getHoldingsInPlay())
        });

        this.action('Place a holding from your deck faceup in the defending province')
            .condition((context) => context.player.dynastyDeck.length > 0 && context.source.isDefending())
            .selectAttackedProvince({
                gameAction: handler({
                    handler: (context, [province]) => deckSearch({
                        activePromptTitle: 'Choose a holding',
                        cardsToLookAt: 5,
                        deck: DeckType.Dynasty,
                        cardCondition: (card) => card.type === CardType.Holding,
                        selectedCardsHandler: (context, _event, [cardFromDeck]) => this.replaceProvinceCards(context, province, cardFromDeck)
                    }).resolve(context.player, context)
                })
            })
            .chatText('look at the top five cards of their dynasty deck');
    }

    private replaceProvinceCards(context: AbilityContext, province: GameActionTarget | undefined, cardFromDeck: DrawCard | undefined): void {
        if(!cardFromDeck) {
            this.game.addMessage(msg`${context.player} takes nothing`);
            return;
        }
        if(!province?.isCard()) {
            return;
        }
        const cards = context.player.getDynastyCardsInProvince(province.location);
        this.game.addMessage(msg`${context.player} discards ${cards}, replacing it with ${cardFromDeck}`);
        placeInProvince({ destination: province.location, discard: 'all' }).resolve(cardFromDeck, context);
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
