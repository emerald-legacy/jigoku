import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type Player from '../../Player.js';
import DrawCard from '../../DrawCard.js';
import { handler } from '../../GameActions/GameActions.js';
import { Location, Players, CardType } from '../../Constants.js';
import { playerChoices } from '../playerChoices.js';

class GovernorsSpy extends DrawCard {
    static id = 'governor-s-spy';

    setupCardAbilities() {
        this.action('Flip a player\'s dynasty cards facedown and rearrange them')
            .condition((context) => context.source.isParticipating())
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => handler({
                handler: (handlerContext) => this.rearrange(handlerContext, player)
            })))
            .chatText('turn facedown and rearrange all of {1}\'s dynasty cards', (context) => (context.select === context.player.name ? context.player : context.player.opponent));
    }

    private rearrange(context: AbilityContext, targetPlayer: Player) {
        const cards = targetPlayer
            .getDynastyCardsInProvince(Location.Provinces)
            .sort((a, b) => a.name.localeCompare(b.name));
        cards.forEach((card) => {
            this.game.applyGameAction(context, { turnFacedown: card });
        });
        const ownedCards = cards.filter((card) => card.owner === targetPlayer);

        const destinations = new Map<BaseCard, Location>();
        let unplacedCards = ownedCards;
        const emptyProvinces = () => this.game.getProvinceArray(false).filter((location) => ![...destinations.values()].includes(location));

        // Once only enough cards are left to fill the empty provinces, they must go there
        const chooseCard = () => this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to place',
            context: context,
            cards: unplacedCards,
            cardHandler: (currentCard) => this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a province for ' + currentCard.name,
                context: context,
                location: Location.Provinces,
                controller: targetPlayer === context.player ? Players.Self : Players.Opponent,
                cardCondition: (card) =>
                    card.type === CardType.Province &&
                    card.location !== Location.StrongholdProvince &&
                    (unplacedCards.length > emptyProvinces().length || emptyProvinces().includes(card.location)),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} places a card', player);
                    unplacedCards = unplacedCards.filter((a) => a !== currentCard);
                    destinations.set(currentCard, card.location);
                    if(unplacedCards.length > 0) {
                        chooseCard();
                    }
                    return true;
                }
            })
        });
        chooseCard();

        context.game.queueSimpleStep(() => {
            ownedCards.forEach((card) => {
                const destination = destinations.get(card);
                if(destination) {
                    targetPlayer.moveCard(card, destination);
                }
            });
            emptyProvinces().forEach((location) => {
                context.refillProvince(targetPlayer, location);
            });
            this.game.addMessage('{0} has finished placing cards', context.player);
        });
    }
}


export default GovernorsSpy;
