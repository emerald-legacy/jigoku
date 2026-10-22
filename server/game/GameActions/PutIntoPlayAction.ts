import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EntersPlayStatus, EventName, Location, Players, RestrictionType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent, Defaults } from './GameAction.js';

export interface PutIntoPlayProperties extends CardActionProperties {
    fate?: number;
    status?: EntersPlayStatus;
    controller?: Players;
    side?: Player;
    overrideLocation?: Location;
}

export type PutIntoPlayDefaults = 'fate' | 'status' | 'controller';

export class PutIntoPlayAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<
    PutIntoPlayProperties,
    EventName.OnCharacterEntersPlay,
    Context,
    PutIntoPlayDefaults
> {
    override name = 'putIntoPlay';
    override restriction = RestrictionType.PutIntoPlay;
    override eventName = EventName.OnCharacterEntersPlay;
    override cost = 'putting {0} into play';
    override targetType = [CardType.Character];
    intoConflict: boolean;
    override defaultProperties: Defaults<PutIntoPlayProperties, PutIntoPlayDefaults> = {
        fate: 0,
        status: EntersPlayStatus.Ordinary,
        controller: Players.Self
    };
    constructor(
        properties: ((context: Context) => PutIntoPlayProperties) | PutIntoPlayProperties,
        intoConflict: boolean
    ) {
        super(properties);
        this.intoConflict = intoConflict;
        if(intoConflict) {
            this.name = 'putIntoConflict';
        }
    }

    getDefaultSide(context: AbilityContext) {
        return context.player;
    }

    getPutIntoPlayPlayer(context: AbilityContext) {
        return context.player;
    }

    protected override effectMessage(): MessageArgs {
        return ['put {0} into play' + (this.intoConflict ? ' in the conflict' : ''), []];
    }

    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const contextCopy = context.copy({ source: card });
        const player = this.getPutIntoPlayPlayer(contextCopy);
        const targetSide = properties.side || this.getDefaultSide(contextCopy);

        if(!super.canAffect(card, context)) {
            return false;
        } else if(!player || card.anotherUniqueInPlay(player)) {
            return false;
        } else if(card.location === Location.PlayArea || card.isFacedown()) {
            return false;
        } else if(!card.checkRestrictions(RestrictionType.PutIntoPlay, context)) {
            return false;
        } else if(!player.checkRestrictions(RestrictionType.EnterPlay, contextCopy)) {
            return false;
        } else if(this.intoConflict) {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!context.game.currentConflict) {
                return false;
            }
            // card cannot participate in this conflict type
            if(card.hasDash(context.game.currentConflict.conflictType)) {
                return false;
            }
            if(!card.checkRestrictions(RestrictionType.PutIntoConflict, context)) {
                return false;
            }

            // its being put into play for its controller, & controller is attacking and character can't attack, or controller is defending and character can't defend
            if(
                (targetSide.isAttackingPlayer() && !card.canParticipateAsAttacker()) ||
                (targetSide.isDefendingPlayer() && !card.canParticipateAsDefender())
            ) {
                return false;
            }
        }
        return true;
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnCharacterEntersPlay, Context>, card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { fate, status, controller, side, overrideLocation } = this.getProperties(
            context,
            additionalProperties
        );
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.fate = fate;
        event.status = status === EntersPlayStatus.Ordinary ? card.entersPlayStatus() : status;
        event.controller = controller;
        event.intoConflict = this.intoConflict;
        event.originalLocation = overrideLocation || card.location;
        event.side = side || this.getDefaultSide(context);
    }

    override eventHandler(event: ActionEvent<EventName.OnCharacterEntersPlay, Context>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const player = this.getPutIntoPlayPlayer(context);
        const card = event.card;
        this.checkForRefillProvince(card, event, additionalProperties);
        card.new = true;
        if(event.fate) {
            card.fate = event.fate;
        }

        let finalController = context.player;
        if(event.controller === Players.Opponent && finalController.opponent) {
            finalController = finalController.opponent;
        }

        const targetSide = event.side;

        if(event.status === EntersPlayStatus.Honored) {
            card.honor();
        } else if(event.status === EntersPlayStatus.Dishonored) {
            card.dishonor();
        }
        if(card.hasPrintedKeyword('corrupted')) {
            card.taint();
        }

        player.moveCard(card, Location.PlayArea);

        //moveCard sets all this stuff and only works if the owner is moving cards, so we're switching it around
        if(card.controller !== finalController) {
            card.controller = finalController;
            card.setDefaultController(card.controller);
            card.owner.cardsInPlay.splice(card.owner.cardsInPlay.indexOf(card), 1);
            card.controller.cardsInPlay.push(card);
        }

        const conflict = context.game.currentConflict;
        if(event.intoConflict && conflict) {
            if(targetSide?.isAttackingPlayer()) {
                conflict.addAttacker(card);
            } else {
                conflict.addDefender(card);
            }
        }
    }
}
