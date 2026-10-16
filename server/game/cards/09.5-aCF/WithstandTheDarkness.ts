import { perPhase } from '../../AbilityLimit.js';
import { placeFate } from '../../GameActions/GameActions.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, type EventName, Location, Players } from '../../Constants.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class WithstandTheDarkness extends DrawCard {
    static id = 'withstand-the-darkness';

    override setupCardAbilities() {
        this.reaction('Place a fate on a character')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event && event.card.controller === context.player.opponent &&
                    this.getChosenCrabCharacters(event, context).length > 0
            })
            .target({
                activePromptTitle: 'Choose a character to receive a fate',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => this.getChosenCrabCharacters(context.event, context).includes(card)
            }, placeFate())
            .max(perPhase(1));
    }

    // chosenCardTargets covers the whole triggering of the played event, sub-resolutions included
    private getChosenCrabCharacters(event: EventPayload<EventName.OnCardPlayed>, context: TriggeredAbilityContext): BaseCard[] {
        return (event.context?.triggeringContext.chosenCardTargets ?? []).filter((card) => this.isValidTargetForWithstand(card, context));
    }

    private isValidTargetForWithstand(card: BaseCard, context: TriggeredAbilityContext) {
        return (
            card.type === CardType.Character &&
            card.isFaction('crab') &&
            card.controller === context.player &&
            card.location === Location.PlayArea
        );
    }
}
