import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, EventName } from '../Constants.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import { targetList, type ActionEvent, type ActionOverrides } from './GameAction.js';

export type FlipDynastyProperties = CardActionProperties;

export class FlipDynastyAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<FlipDynastyProperties, EventName.OnCardRevealed, Context> {
    override name = 'flipDynasty';
    override eventName = EventName.OnCardRevealed;
    override targetType = [CardType.Character, CardType.Holding, CardType.Event];

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const targets = targetList(this.getProperties(context, additionalProperties).target);
        return [targets.length > 1 ? 'reveal the facedown cards in {0}' : 'reveal the facedown card in {0}', []];
    }

    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        const locations = targetList(this.getProperties(context, additionalProperties).target).map((target) => target.location);
        return locations.length > 1 ? locations : locations[0] ?? '';
    }

    override canAffect(card: BaseCard, context: Context): boolean {
        return card.isInProvince() && card.isDynasty && card.isFacedown() && super.canAffect(card, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnCardRevealed, Context>): void {
        event.card.facedown = false;
    }
}
