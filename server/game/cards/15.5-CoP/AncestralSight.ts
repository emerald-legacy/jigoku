import DrawCard from '../../DrawCard.js';
import BaseCard from '../../BaseCard.js';
import { CardTypes, Players, AbilityTypes, TargetModes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';

const isCopyInPlay = function(card: BaseCard, context: AbilityContext) {
    return context.game.findAnyCardsInPlay((c: BaseCard) => c.name === card.name).length > 0;
};

const ancestralSightCost = function () {
    return {
        action: { name: 'ancestralSightCost' },
        getActionName(_context: AbilityContext) {
            return 'ancestralSightCost';
        },
        getCostMessage: function (_context: AbilityContext) {
            return ['returning {0} to the bottom of the dynasty deck'];
        },
        canPay: function (context: AbilityContext) {
            const discardPile = context.player.dynastyDiscardPile;
            if(!discardPile) {
                return false;
            }
            return discardPile.some((card: BaseCard) => isCopyInPlay(card, context));
        },
        resolve: function (context: AbilityContext, result: { cancelled?: boolean }) {
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a card to return to your deck',
                context: context,
                mode: TargetModes.Single,
                location: Locations.DynastyDiscardPile,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card: BaseCard, ctx: AbilityContext) => isCopyInPlay(card, ctx),
                onSelect: (_player: Player, card: BaseCard) => {
                    context.costs.ancestralSightCost = card;
                    return true;
                },
                onCancel: () => {
                    result.cancelled = true;
                    return true;
                }
            });
        },
        payEvent: function (context: AbilityContext) {
            const action = context.game.actions.returnToDeck({ target: context.costs.ancestralSightCost as DrawCard, bottom: true, location: Locations.DynastyDiscardPile });
            return action.getEvent(context.costs.ancestralSightCost, context);
        },
        promptsPlayer: true
    };
};

class AncestralSight extends DrawCard {
    static id = 'ancestral-sight';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'shugenja'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Put a fate on a character',
                cost: ancestralSightCost(),
                printedAbility: false,
                cannotTargetFirst: true,
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card: any, context: AbilityContext) => {
                        return !context.costs.ancestralSightCost || context.costs.ancestralSightCost && card.name === (context.costs.ancestralSightCost as DrawCard).name;
                    },
                    gameAction: AbilityDsl.actions.placeFate((context: AbilityContext) => ({ origin: context.player }))
                }
            })
        });
    }
}


export default AncestralSight;
