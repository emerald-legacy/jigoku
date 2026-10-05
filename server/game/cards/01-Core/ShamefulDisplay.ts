import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, TargetMode } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

const STATUSES = ['Honor', 'Dishonor'] as const;
type Status = typeof STATUSES[number];

export default class ShamefulDisplay extends ProvinceCard {
    static id = 'shameful-display';

    setupCardAbilities() {
        this.action('Dishonor/Honor two characters')
            .targetCards({
                mode: TargetMode.Exactly,
                numCards: 2,
                cardType: CardType.Character,
                activePromptTitle: 'Select two characters',
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.honor(), AbilityDsl.actions.dishonor())
            .handler((context) => this.chooseStatus(context, context.targets.target))
            .effect('change the personal honor of {0}');
    }

    private chooseStatus(context: AbilityContext, pair: readonly BaseCard[]) {
        const statuses = STATUSES.filter((status) => pair.some((card) => canApply(status, card, context)));
        if(statuses.length === 1) {
            this.chooseCharacter(statuses[0], context, pair, false);
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose a character to:',
            context,
            options: statuses.map((status) => ({ text: status, handler: () => this.chooseCharacter(status, context, pair, true) }))
        });
    }

    private chooseCharacter(status: Status, context: AbilityContext, pair: readonly BaseCard[], canGoBack: boolean) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: `Choose a character to ${status.toLowerCase()}`,
            context,
            cardCondition: (card) => pair.includes(card) && canApply(status, card, context),
            buttons: canGoBack ? [{ text: 'Back', arg: 'back' }] : [],
            onSelect: (_player, chosen) => {
                const other = pair.find((card) => card !== chosen);
                const [honored, dishonored] = status === 'Honor' ? [chosen, other] : [other, chosen];
                context.game.addMessage('{0} chooses to honor {1} and dishonor {2}', context.player, honored, dishonored);
                context.game.applyGameAction(context, { honor: honored, dishonor: dishonored });
                return true;
            },
            onMenuCommand: () => {
                this.chooseStatus(context, pair);
                return true;
            }
        });
    }
}

function canApply(status: Status, card: BaseCard, context: AbilityContext) {
    const action = status === 'Honor' ? AbilityDsl.actions.honor() : AbilityDsl.actions.dishonor();
    return action.canAffect(card, context);
}
