import type { AbilityContext } from '../AbilityContext.js';
import BaseCard from '../BaseCard.js';
import { Location, Players } from '../Constants.js';
import type { Cost, CostMessage, Result } from './Cost.js';
import type { Event } from '../Events/Event.js';
import type { SelectCardAction } from '../GameActions/SelectCardAction.js';
import type { SelectRingAction } from '../GameActions/SelectRingActions.js';
import Ring from '../Ring.js';
import { randomItem } from '../utils/helpers.js';
import { GameActionCost } from './GameActionCost.js';

/** A cost paid by choosing a card or a ring, then resolving the select's game action on it. */
export class MetaActionCost extends GameActionCost implements Cost {
    constructor(
        public action: SelectCardAction | SelectRingAction,
        public activePromptTitle: string
    ) {
        super(action);
    }

    getActionName(context: AbilityContext): string {
        const { gameAction } = this.action.getProperties(context);
        return gameAction.name;
    }

    canPay(context: AbilityContext): boolean {
        const properties = this.action.getProperties(context);
        let additionalProps = {
            controller: Players.Self,
            location: ('location' in properties ? properties.location : undefined) || Location.Any
        };
        return this.action.hasLegalTarget(context, additionalProps);
    }

    addEventsToArray(events: Event[], context: AbilityContext, result: Result): void {
        const properties = this.action.getProperties(context);
        const name = properties.gameAction.name;
        if(properties.targets && context.choosingPlayerOverride && 'selector' in properties && properties.selector) {
            const chosen = randomItem(properties.selector.getAllLegalTargets(context, context.player));
            context.costs[name] = chosen;
            context.costs[name + 'StateWhenChosen'] = chosen.createSnapshot();
            return properties.gameAction.addEventsToArray(events, context, {
                target: chosen
            });
        }

        const additionalProps = {
            activePromptTitle: this.activePromptTitle,
            location: ('location' in properties ? properties.location : undefined) || Location.Any,
            controller: Players.Self,
            cancelHandler: !result.canCancel ? null : () => (result.cancelled = true),
            subActionProperties: (target: BaseCard | BaseCard[] | Ring) => {
                context.costs[name] = target;
                if(target instanceof BaseCard) {
                    context.costs[name + 'StateWhenChosen'] = target.createSnapshot();
                }
                if('ringCondition' in properties) {
                    return target instanceof Ring ? properties.subActionProperties(target) : {};
                }
                return target instanceof Ring ? {} : properties.subActionProperties(target);
            }
        };
        this.action.addEventsToArray(events, context, additionalProps);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.action.hasTargetsChosenByInitiatingPlayer(context);
    }

    getCostMessage(context: AbilityContext): CostMessage {
        const properties = this.action.getProperties(context);
        return properties.gameAction.getCostMessage(context) ?? [];
    }
}
