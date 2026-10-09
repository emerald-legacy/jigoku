import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Players, Location } from '../../Constants.js';
import { gainAbility } from '../../effects.js';
import { placeFate, returnToDeck } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { Cost } from '../../costs/Cost.js';

function isCopyInPlay(card: BaseCard, context: AbilityContext) {
    return context.game.findAnyCardsInPlay((c) => c.name === card.name).length > 0;
}

function ancestralSightCost(): Cost<{ ancestralSightCost: DrawCard }> {
    return {
        getActionName(_context) {
            return 'ancestralSightCost';
        },
        getCostMessage(_context) {
            return ['returning {0} to the bottom of the dynasty deck'];
        },
        canPay(context) {
            return context.player.dynastyDiscardPile.some((card) => isCopyInPlay(card, context));
        },
        resolve(context, result) {
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a card to return to your deck',
                context: context,

                location: Location.DynastyDiscardPile,
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, ctx) => isCopyInPlay(card, ctx),
                onSelect: (_player, card) => {
                    if(card.isDrawCard()) {
                        context.costs.ancestralSightCost = card;
                    }
                    return true;
                },
                onCancel: () => {
                    result.cancelled = true;
                    return true;
                }
            });
        },
        payEvent(context) {
            const action = returnToDeck({ target: context.costs.ancestralSightCost, bottom: true, location: Location.DynastyDiscardPile });
            return action.getEvent(context.costs.ancestralSightCost, context);
        },
        promptsPlayer: true
    };
}

class AncestralSight extends DrawCard {
    static id = 'ancestral-sight';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'shugenja'
        });

        this.whileAttached({
            effect: gainAbility.action('Put a fate on a character', (ability) => ability
                .cost(ancestralSightCost())
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) => {
                        const returned = context.costs.ancestralSightCost;
                        return !returned || (returned instanceof DrawCard && card.name === returned.name);
                    }
                }, placeFate((context) => ({ origin: context.player })))
                .cannotTargetFirst())
        });
    }
}


export default AncestralSight;
