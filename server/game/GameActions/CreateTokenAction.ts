import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, Duration, EventName, Location, ConflictType } from '../Constants.js';
import Effects from '../effects.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import SpiritOfTheRiver from '../cards/SpiritOfTheRiver.js';
import type { ActionEvent } from './GameAction.js';

export interface CreateTokenProperties extends CardActionProperties {
    token: new (card: DrawCard) => DrawCard;
    leavingPlayMessage?: string;
    canEnterConflict: (type: ConflictType) => boolean;
}

export class CreateTokenAction<C extends AbilityContext = AbilityContext> extends CardGameAction<
    CreateTokenProperties,
    EventName.OnCreateTokenCharacter,
    C,
    'token' | 'leavingPlayMessage' | 'canEnterConflict'
> {
    name = 'createToken';
    effect = 'create a token';
    eventName = EventName.OnCreateTokenCharacter;
    targetType = [CardType.Character, CardType.Holding, CardType.Event];
    defaultProperties = {
        token: SpiritOfTheRiver,
        leavingPlayMessage: '{0} returns to the deep',
        canEnterConflict: () => true
    };

    canAffect(card: BaseCard, context: C): boolean {
        const { canEnterConflict } = this.getProperties(context);

        if(!card.isFacedown() || !card.isInProvince() || card.location === Location.StrongholdProvince) {
            return false;
        } else if(context.game.isDuringConflict(ConflictType.Military) && !canEnterConflict(ConflictType.Military)) {
            return false;
        } else if(context.game.isDuringConflict(ConflictType.Political) && !canEnterConflict(ConflictType.Political)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: ActionEvent<EventName.OnCreateTokenCharacter, C>, additionalProperties: Record<string, unknown> = {}): void {
        const context = event.context;
        const { token: propToken, leavingPlayMessage } = this.getProperties(context, additionalProperties);
        const card = event.card;
        const token = context.game.createToken(card, propToken);
        card.owner.removeCardFromPile(card);
        this.checkForRefillProvince(card, event, additionalProperties);
        card.moveTo(Location.RemovedFromGame);
        card.owner.moveCard(token, Location.PlayArea);
        const conflict = context.game.currentConflict;
        if(conflict) {
            if(context.player.isAttackingPlayer()) {
                conflict.addAttacker(token);
            } else {
                conflict.addDefender(token);
            }
        }

        context.game.actions
            .cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: Effects.delayedEffect({
                    when: {
                        onConflictFinished: () => true
                    },
                    message: leavingPlayMessage,
                    messageArgs: [token],
                    gameAction: context.game.actions.discardFromPlay()
                })
            })
            .resolve(token, context);

        event.tokenCharacter = token;
    }
}
