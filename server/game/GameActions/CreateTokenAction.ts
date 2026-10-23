import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, Duration, EventName, Location, ConflictType, RestrictionType } from '../Constants.js';
import { delayedEffect } from '../Effects/Library/delayedEffect.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';
import { CardLastingEffectAction } from './CardLastingEffectAction.js';
import { DiscardFromPlayAction } from './LeavesPlayAction.js';

export interface CreateTokenProperties extends CardActionProperties {
    token: new (card: DrawCard) => DrawCard;
    leavingPlayMessage?: string;
    canEnterConflict: (type: ConflictType) => boolean;
}

export class CreateTokenAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<
    CreateTokenProperties,
    EventName.OnCreateTokenCharacter,
    Context,
    'leavingPlayMessage' | 'canEnterConflict'
> {
    override name = 'createToken';
    override effect = 'create a token';
    override eventName = EventName.OnCreateTokenCharacter;
    override targetType = [CardType.Character, CardType.Holding, CardType.Event];
    override defaultProperties = {
        leavingPlayMessage: '{0} returns to the deep',
        canEnterConflict: () => true
    };

    override canAffect(card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { canEnterConflict, token } = this.getProperties(context, additionalProperties);

        if(!card.isFacedown() || !card.isInProvince() || card.location === Location.StrongholdProvince || !card.isDrawCard()) {
            return false;
        } else if(!card.owner.checkRestrictions(RestrictionType.EnterPlay, context.copy({ source: new token(card) }))) {
            return false;
        } else if(context.game.isDuringConflict(ConflictType.Military) && !canEnterConflict(ConflictType.Military)) {
            return false;
        } else if(context.game.isDuringConflict(ConflictType.Political) && !canEnterConflict(ConflictType.Political)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    override eventHandler(event: ActionEvent<EventName.OnCreateTokenCharacter, Context>, additionalProperties: ActionOverrides = {}): void {
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

        new CardLastingEffectAction({
            duration: Duration.UntilEndOfPhase,
            effect: delayedEffect({
                when: {
                    onConflictFinished: () => true
                },
                message: () => [leavingPlayMessage, [token]],
                gameAction: new DiscardFromPlayAction({})
            })
        })
            .resolve(token, context);

        event.tokenCharacter = token;
    }
}
