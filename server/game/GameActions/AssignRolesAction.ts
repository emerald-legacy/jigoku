import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { resolveChoosingPlayer, type Chooser } from './resolveChoosingPlayer.js';
import { type EventName, Players } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type { MessageArgs } from '../GameChat.js';
import type { GameObject } from '../GameObject.js';
import type Player from '../Player.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import { targetList, type GameAction } from './GameAction.js';

export interface AssignRolesProperties<R extends string = string, C extends AbilityContext = AbilityContext> extends CardActionProperties {
    /** Each role's action, resolved on the card given that role: two roles for two cards. */
    roles: Record<R, GameAction>;
    /** Who gives the roles. */
    player?: Chooser;
    /** The chooser picks this role's card from card buttons, and the other card gets the other role. */
    pick?: NoInfer<R>;
    /**
     * Any number of cards: the chooser picks one card for each of these roles from card buttons, in this order
     * ("Select a card to <role>"), and each pick resolves at once; the cards left take the one role not listed.
     * While there are fewer cards than roles left, a role may be skipped ("None").
     */
    pickOrder?: NoInfer<R>[];
    /** With `pickOrder`: a chat line when a role is given. */
    messages?: Partial<Record<NoInfer<R>, (context: AbilityContext, card: BaseCard, chooser: Player) => MessageArgs>>;
    activePromptTitle?: string;
    /** Printed once each card has its role. Method syntax, so a card's narrower role names fit. */
    message?(context: C, assigned: Record<NoInfer<R>, BaseCard>, chooser: Player): MessageArgs;
}

/**
 * "Honor one of those characters and dishonor the other": the chooser gives each role to one of
 * two cards while the action resolves. The roles' actions resolve together, in this action's window.
 */
export class AssignRolesAction<C extends AbilityContext = AbilityContext> extends CardGameAction<AssignRolesProperties, EventName.Unnamed, C, 'player'> {
    override name = 'assignRoles';
    override defaultProperties: { player: Chooser } = { player: Players.Self };

    #canTake(role: string, card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const action = this.getProperties(context, additionalProperties).roles[role];
        return !!action && action.canAffect(card, context, { target: card });
    }

    override canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { roles } = this.getProperties(context, additionalProperties);
        return target.isCard() && Object.keys(roles).some((role) => this.#canTake(role, target, context, additionalProperties));
    }

    #chooser(context: C, additionalProperties: ActionOverrides = {}): Player | undefined {
        return resolveChoosingPlayer(context, this.getProperties(context, additionalProperties).player);
    }

    override addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const cards = targetList(properties.target).filter((target) => target.isCard());
        const [first, second] = Object.keys(properties.roles);
        const chooser = this.#chooser(context, additionalProperties);
        if(properties.pickOrder && chooser) {
            const pickOrder = properties.pickOrder;
            const last = Object.keys(properties.roles).find((role) => !pickOrder.includes(role));
            this.#pickInOrder(cards, pickOrder, last, chooser, context, additionalProperties);
            return;
        }
        if(cards.length !== 2 || first === undefined || second === undefined || !chooser) {
            return;
        }
        const assign = (role: string, card: BaseCard) => {
            const other = cards.find((candidate) => candidate !== card);
            if(!other) {
                return;
            }
            const otherRole = role === first ? second : first;
            const assigned: Record<string, BaseCard> = { [role]: card, [otherRole]: other };
            if(properties.message) {
                context.game.addMessage(properties.message(context, assigned, chooser));
            }
            properties.roles[role].addEventsToArray(events, context, { target: card });
            properties.roles[otherRole].addEventsToArray(events, context, { target: other });
        };
        if(properties.pick) {
            const pick = properties.pick;
            context.game.promptWithHandlerMenu(chooser, {
                activePromptTitle: properties.activePromptTitle,
                context,
                cards: cards.filter((card) => this.#canTake(pick, card, context, additionalProperties)),
                cardHandler: (card) => assign(pick, card)
            });
            return;
        }
        this.#chooseRole(cards, [first, second], chooser, assign, context, additionalProperties);
    }

    #pickInOrder(cards: BaseCard[], [role, ...later]: string[], last: string | undefined, chooser: Player, context: C, additionalProperties: ActionOverrides): void {
        const properties = this.getProperties(context, additionalProperties);
        const give = (role: string, card: BaseCard) => {
            const message = properties.messages?.[role];
            if(message) {
                context.game.addMessage(message(context, card, chooser));
            }
            if(!properties.roles[role].isNoAction) {
                properties.roles[role].resolve(card, context);
            }
        };
        if(role === undefined) {
            if(last !== undefined) {
                for(const card of cards) {
                    give(last, card);
                }
            }
            return;
        }
        const next = (rest: BaseCard[]) => this.#pickInOrder(rest, later, last, chooser, context, additionalProperties);
        if(cards.length === 0) {
            return;
        }
        const rolesLeft = later.length + 1 + (last !== undefined ? 1 : 0);
        context.game.promptWithHandlerMenu(chooser, {
            activePromptTitle: `Select a card to ${role}`,
            context,
            cards: cards.filter((card) => this.#canTake(role, card, context, additionalProperties)),
            cardHandler: (card: BaseCard) => {
                give(role, card);
                next(cards.filter((other) => other !== card));
            },
            options: cards.length < rolesLeft ? [{ text: 'None', handler: () => next(cards) }] : []
        });
    }

    #chooseRole(cards: BaseCard[], roles: string[], chooser: Player, assign: (role: string, card: BaseCard) => void, context: C, additionalProperties: ActionOverrides): void {
        const possible = roles.filter((role) => cards.some((card) => this.#canTake(role, card, context, additionalProperties)));
        if(possible.length === 1) {
            this.#chooseCard(possible[0], cards, roles, chooser, assign, false, context, additionalProperties);
            return;
        }
        context.game.promptWithHandlerMenu(chooser, {
            activePromptTitle: this.getProperties(context, additionalProperties).activePromptTitle ?? 'Choose a character to:',
            context,
            options: possible.map((role) => ({
                text: role,
                handler: () => this.#chooseCard(role, cards, roles, chooser, assign, true, context, additionalProperties)
            }))
        });
    }

    #chooseCard(
        role: string,
        cards: BaseCard[],
        roles: string[],
        chooser: Player,
        assign: (role: string, card: BaseCard) => void,
        canGoBack: boolean,
        context: C,
        additionalProperties: ActionOverrides
    ): void {
        context.game.promptForSelect(chooser, {
            activePromptTitle: `Choose a character to ${role.toLowerCase()}`,
            context,
            cardCondition: (card: BaseCard) => cards.includes(card) && this.#canTake(role, card, context, additionalProperties),
            buttons: canGoBack ? [{ text: 'Back', arg: 'back' }] : [],
            onSelect: (_player: Player, card: BaseCard) => {
                assign(role, card);
                return true;
            },
            onMenuCommand: () => {
                this.#chooseRole(cards, roles, chooser, assign, context, additionalProperties);
                return true;
            }
        });
    }
}
