import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { Cost, Result } from '../../costs/Cost.js';
import type Player from '../../Player.js';
import { CardType, Players, Duration, TargetMode, Location } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

const agreeableCost = (): Cost<{ agreeableArrangementCost: DrawCard }> => ({
    getActionName(_context) {
        return 'agreeableArrangementCost';
    },
    getCostMessage: function (context) {
        return ['giving {1} control of {0}', context.player.opponent];
    },
    canPay: function(context) {
        const opponent = context.player.opponent;
        return !!opponent && context.player.cardsInPlay.some((card: DrawCard) => (card.printedCost ?? 0) >= 2 && !card.bowed && !card.anotherUniqueInPlay(opponent));
    },
    resolve: function (context, result: Result) {
        const opponent = context.player.opponent;
        context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a card to give to your opponent',
            context: context,
            mode: TargetMode.Single,
            numCards: 1,
            location: Location.PlayArea,
            cardType: CardType.Character,
            controller: Players.Self,
            cardCondition: (card: DrawCard) => !!opponent && (card.printedCost ?? 0) >= 2 && !card.bowed && !card.anotherUniqueInPlay(opponent),
            onSelect: (_player: Player, card: DrawCard) => {
                context.costs.agreeableArrangementCost = card;
                return true;
            },
            onCancel: () => {
                result.cancelled = true;
                return true;
            }
        });
    },
    payEvent: function(context) {
        const card = context.costs.agreeableArrangementCost;
        const action = context.game.actions.cardLastingEffect((innerContext: AbilityContext) => ({
            target: card,
            effect: AbilityDsl.effects.takeControl(innerContext.player.opponent),
            duration: Duration.Custom
        }));
        const events = [];
        events.push(action.getEvent(card, context));
        return events;
    }
});

class AnAgreeableArrangement extends DrawCard {
    static id = 'an-agreeable-arrangement';

    setupCardAbilities() {
        this.action('Bow a non-champion')
            .cost(agreeableCost())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.hasTrait('champion'),
                activePromptTitle: 'Bow a non-champion'
            }, AbilityDsl.actions.bow());
    }
}


export default AnAgreeableArrangement;
