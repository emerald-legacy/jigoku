import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, Location, Players } from '../Constants.js';
import type DrawCard from '../DrawCard.js';

/** Puts the chosen cards faceup into the player's non-stronghold provinces, one per province, then shuffles their dynasty deck. */
export function placeInProvinces(context: AbilityContext, cards: DrawCard[]): void {
    const provinceCount = context.game.getProvinceArray(false).length;
    const chosenProvinces: BaseCard[] = [];
    let remaining = cards;

    const chooseCard = () => {
        if(remaining.length === 0 || chosenProvinces.length >= provinceCount) {
            context.player.shuffleDynastyDeck();
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to place in a province',
            context: context,
            cards: remaining,
            cardHandler: (currentCard) => context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a province for ' + currentCard.name,
                context: context,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) =>
                    card.type === CardType.Province && card.location !== Location.StrongholdProvince && !chosenProvinces.includes(card),
                onSelect: (_player, card) => {
                    context.game.addMessage(
                        '{0} puts {1} into {2}',
                        context.player,
                        currentCard,
                        card.isFacedown() ? 'a facedown province' : card.name
                    );
                    chosenProvinces.push(card);
                    context.player.moveCard(currentCard, card.location);
                    currentCard.facedown = false;
                    remaining = remaining.filter((a) => a !== currentCard);
                    chooseCard();
                    return true;
                }
            })
        });
    };

    chooseCard();
}
