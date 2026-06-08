import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type { MsgArg } from '../GameChat.js';
import { Location, Players } from '../Constants.js';
import type { Cost, Result } from './Cost.js';
import type { Event } from '../Events/Event.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type { SelectCardProperties } from '../GameActions/SelectCardAction.js';
import { randomItem } from '../utils/helpers.js';
import { GameActionCost } from './GameActionCost.js';

export class MetaActionCost extends GameActionCost implements Cost {
    constructor(
        action: GameAction,
        public activePromptTitle: string
    ) {
        super(action);
    }

    getActionName(context: AbilityContext): string {
        const { gameAction } = this.action.getProperties(context) as SelectCardProperties;
        return gameAction.name;
    }

    canPay(context: AbilityContext): boolean {
        const properties = this.action.getProperties(context) as SelectCardProperties;
        let additionalProps = {
            controller: Players.Self,
            location: properties.location || Location.Any
        };
        return this.action.hasLegalTarget(context, additionalProps);
    }

    addEventsToArray(events: Event[], context: AbilityContext, result: Result): void {
        const properties = this.action.getProperties(context) as SelectCardProperties;
        if(properties.targets && context.choosingPlayerOverride && properties.selector) {
            context.costs[properties.gameAction.name] = randomItem(
                properties.selector.getAllLegalTargets(context, context.player)
            );
            context.costs[properties.gameAction.name + 'StateWhenChosen'] =
                (context.costs[properties.gameAction.name] as BaseCard).createSnapshot();
            return properties.gameAction.addEventsToArray(events, context, {
                target: context.costs[properties.gameAction.name]
            });
        }

        const additionalProps = {
            activePromptTitle: this.activePromptTitle,
            location: properties.location || Location.Any,
            controller: Players.Self,
            cancelHandler: !result.canCancel ? null : () => (result.cancelled = true),
            subActionProperties: (target: BaseCard) => {
                context.costs[properties.gameAction.name] = target;
                if(target.createSnapshot) {
                    context.costs[properties.gameAction.name + 'StateWhenChosen'] = target.createSnapshot();
                }
                return properties.subActionProperties ? properties.subActionProperties(target) : {};
            }
        };
        this.action.addEventsToArray(events, context, additionalProps);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext): boolean {
        return this.action.hasTargetsChosenByInitiatingPlayer(context);
    }

    getCostMessage(context: AbilityContext): MsgArg[] {
        const properties = this.action.getProperties(context) as SelectCardProperties;
        return properties.gameAction.getCostMessage(context) ?? [];
    }
}
