import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardTypes, Durations, EventNames, Locations } from '../Constants.js';
import Effects from '../effects.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface CreateTokenProperties extends CardActionProperties {
    atHome?: boolean;
}

export class CreateTokenAction extends CardGameAction<CreateTokenProperties> {
    name = 'createToken';
    effect = 'create a token';
    eventName = EventNames.OnCreateTokenCharacter;
    targetType = [CardTypes.Character, CardTypes.Holding, CardTypes.Event];
    defaultProperties: CreateTokenProperties = { atHome: false };

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.isFacedown() || !card.isInProvince() || card.location === Locations.StrongholdProvince) {
            return false;
        } else if(!context.game.isDuringConflict('military')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: GameEvent<EventNames.OnCreateTokenCharacter>, additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context as AbilityContext;
        let { atHome } = this.getProperties(context, additionalProperties);
        let card = event.card as DrawCard;
        let token = context.game.createToken(card);
        card.owner.removeCardFromPile(card);
        this.checkForRefillProvince(card, event, additionalProperties);
        card.moveTo(Locations.RemovedFromGame);
        card.owner.moveCard(token, Locations.PlayArea);
        const conflict = context.game.currentConflict;
        if(!atHome && conflict) {
            if(context.player.isAttackingPlayer()) {
                conflict.addAttacker(token);
            } else {
                conflict.addDefender(token);
            }
        }

        context.game.actions
            .cardLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: Effects.delayedEffect({
                    when: {
                        onConflictFinished: () => true
                    },
                    message: '{0} returns to the deep',
                    messageArgs: [token],
                    gameAction: context.game.actions.discardFromPlay()
                })
            })
            .resolve(token, context);

        context.game.raiseEvent(EventNames.OnCreateTokenCharacter, { tokenCharacter: token });
    }
}
