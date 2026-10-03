import DrawCard from '../../DrawCard.js';
import BaseCard from '../../BaseCard.js';
import { CardType, Players, AbilityType, TargetMode, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
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
            const discardPile = context.player.dynastyDiscardPile;
            if(!discardPile) {
                return false;
            }
            return discardPile.some((card) => isCopyInPlay(card, context));
        },
        resolve(context, result) {
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a card to return to your deck',
                context: context,
                mode: TargetMode.Single,
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
            const action = context.game.actions.returnToDeck({ target: context.costs.ancestralSightCost, bottom: true, location: Location.DynastyDiscardPile });
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
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Put a fate on a character',
                cost: ancestralSightCost(),
                printedAbility: false,
                cannotTargetFirst: true,
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card, context) => {
                        const returned = context.costs.ancestralSightCost;
                        return !returned || (returned instanceof DrawCard && card.name === returned.name);
                    },
                    gameAction: AbilityDsl.actions.placeFate((context) => ({ origin: context.player }))
                }
            })
        });
    }
}


export default AncestralSight;
