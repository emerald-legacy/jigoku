import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import { CardTypes, Durations, EventNames, Locations } from '../Constants.js';
import Effects from '../effects.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

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

    eventHandler(event, additionalProperties = {}): void {
        let { atHome } = this.getProperties(event.context, additionalProperties);
        let context = event.context;
        let card = event.card;
        let token = context.game.createToken(card);
        card.owner.removeCardFromPile(card);
        this.checkForRefillProvince(card, event, additionalProperties);
        card.moveTo(Locations.RemovedFromGame);
        card.owner.moveCard(token, Locations.PlayArea);
        if(!atHome) {
            if(context.player.isAttackingPlayer()) {
                context.game.currentConflict.addAttacker(token);
            } else {
                context.game.currentConflict.addDefender(token);
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
