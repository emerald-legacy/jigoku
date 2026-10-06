import { takeControl } from '../../effects.js';
import { bow } from '../../GameActions/GameActions.js';
import type { Cost } from '../../costs/Cost.js';
import { CardType, Players, Duration, Location } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

const agreeableCost = (): Cost<{ agreeableArrangementCost: DrawCard }> => ({
    getActionName(_context) {
        return 'agreeableArrangementCost';
    },
    getCostMessage(context) {
        return ['giving {1} control of {0}', context.player.opponent];
    },
    canPay(context) {
        const opponent = context.player.opponent;
        return !!opponent && context.player.cardsInPlay.some((card) => (card.printedCost ?? 0) >= 2 && !card.bowed && !card.anotherUniqueInPlay(opponent));
    },
    resolve(context, result) {
        const opponent = context.player.opponent;
        context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a card to give to your opponent',
            context: context,

            location: Location.PlayArea,
            cardType: CardType.Character,
            controller: Players.Self,
            cardCondition: (card) => !!opponent && (card.printedCost ?? 0) >= 2 && !card.bowed && !card.anotherUniqueInPlay(opponent),
            onSelect: (_player, card) => {
                context.costs.agreeableArrangementCost = card;
                return true;
            },
            onCancel: () => {
                result.cancelled = true;
                return true;
            }
        });
    },
    payEvent(context) {
        const card = context.costs.agreeableArrangementCost;
        const action = context.game.actions.cardLastingEffect((innerContext) => ({
            target: card,
            effect: takeControl(innerContext.player.opponent),
            duration: Duration.Custom
        }));
        return [action.getEvent(card, context)];
    }
});

class AnAgreeableArrangement extends DrawCard {
    static id = 'an-agreeable-arrangement';

    setupCardAbilities() {
        this.action('Bow a non-champion')
            .cost(agreeableCost())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.hasTrait('champion'),
                activePromptTitle: 'Bow a non-champion'
            }, bow());
    }
}


export default AnAgreeableArrangement;
