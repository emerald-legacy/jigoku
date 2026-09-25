import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type { Event } from '../../Events/Event.js';
import { GameAction } from '../../GameActions/GameAction.js';
import type { MessageArgs } from '../../GameChat.js';
import type { GameObject } from '../../GameObject.js';
import type Player from '../../Player.js';

export interface AssignOptions {
    /** The player who assigns the roles. The default is the player of the ability. */
    chooser?: Player;
    /** The title of the role menu. The default is "Choose a character to:". */
    prompt?: string;
    /** The button labels of the roles. The default is the capitalized role key. */
    labels?: Record<string, string>;
}

type RoleActions = Record<string, (card: BaseCard) => undefined | GameAction>;

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * "Honor one of those characters and dishonor the other": the chooser gives each role to one
 * of two cards while the effect resolves. All role effects resolve at the same time.
 */
export class AssignAction extends GameAction {
    name = 'builderAssign';

    constructor(
        private readonly cards: readonly BaseCard[],
        private readonly roles: RoleActions,
        private readonly options: AssignOptions
    ) {
        super({ target: [...cards] });
    }

    setDefaultTarget(): void {}

    private roleCanAffect(role: string, card: BaseCard, context: AbilityContext): boolean {
        return this.roles[role](card)?.canAffect(card, context) ?? false;
    }

    canAffect(target: GameObject, context: AbilityContext): boolean {
        const card = target as BaseCard;
        return (
            this.cards.includes(card) && Object.keys(this.roles).some((role) => this.roleCanAffect(role, card, context))
        );
    }

    hasLegalTarget(context: AbilityContext): boolean {
        return this.cards.some((card) => this.canAffect(card, context));
    }

    getEffectMessage(): MessageArgs {
        return ['', []];
    }

    addEventsToArray(events: Event[], context: AbilityContext): void {
        const [first, second] = Object.keys(this.roles);
        if(this.cards.length !== 2 || !first || !second) {
            throw new Error('Ability builder: assign supports two cards and two roles');
        }

        const possible = [first, second].filter((role) =>
            this.cards.some((card) => this.roleCanAffect(role, card, context))
        );
        const finish = (role: string, card: BaseCard) => {
            const other = this.cards.find((candidate) => candidate !== card) as BaseCard;
            const otherRole = role === first ? second : first;
            for(const [assigned, target] of [
                [role, card],
                [otherRole, other]
            ] as const) {
                this.roles[assigned](target)?.addEventsToArray(events, context);
            }
        };

        if(possible.length === 1) {
            this.chooseCard(possible[0], context, finish, false);
        } else {
            this.chooseRole([first, second], context, finish);
        }
    }

    private get chooser() {
        return (context: AbilityContext) => this.options.chooser ?? context.player;
    }

    private label(role: string): string {
        return this.options.labels?.[role] ?? capitalize(role);
    }

    private chooseRole(roles: string[], context: AbilityContext, finish: (role: string, card: BaseCard) => void): void {
        context.game.promptWithHandlerMenu(this.chooser(context), {
            activePromptTitle: this.options.prompt ?? 'Choose a character to:',
            context,
            choices: roles.map((role) => this.label(role)),
            handlers: roles.map((role) => () => this.chooseCard(role, context, finish, true, roles))
        });
    }

    private chooseCard(
        role: string,
        context: AbilityContext,
        finish: (role: string, card: BaseCard) => void,
        canGoBack: boolean,
        roles: string[] = []
    ): void {
        context.game.promptForSelect(this.chooser(context), {
            activePromptTitle: `Choose a character to ${this.label(role).toLowerCase()}`,
            context,
            cardCondition: (card: BaseCard) => this.cards.includes(card) && this.roleCanAffect(role, card, context),
            buttons: canGoBack ? [{ text: 'Back', arg: 'back' }] : [],
            onSelect: (_player: Player, card: BaseCard) => {
                finish(role, card);
                return true;
            },
            onMenuCommand: (_player: Player, arg: string) => {
                if(arg !== 'back') {
                    return false;
                }
                this.chooseRole(roles, context, finish);
                return true;
            }
        });
    }
}
