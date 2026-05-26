import { GameModes } from '../../GameModes.js';
import { CardTypes, Locations } from '../Constants.js';
import { AbilityContext } from '../AbilityContext.js';
import BaseAbility from '../baseability.js';
import DrawCard from '../drawcard.js';

function cardConditionSkirmish<C extends DrawCard>(card: C, context: AbilityContext) {
    return (
        card.location === Locations.PlayArea &&
        card.getFate() <= 1 &&
        !card.isParticipating() &&
        ((!card.bowed && card.allowGameAction('bow', context)) || (card.bowed && card.allowGameAction('ready', context)))
    );
}

function cardConditionDefault<C extends DrawCard>(card: C, context: AbilityContext) {
    return (
        card.location === Locations.PlayArea &&
        ((card.getFate() === 0 && card.allowGameAction('bow', context)) || card.bowed)
    );
}

export class WaterRingEffect extends BaseAbility {
    public title = 'Water Ring Effect';
    public cannotTargetFirst = true;
    public defaultPriority = 3; // Default resolution priority when players have ordering switched off

    constructor(
        optional: boolean,
        gameMode: GameModes,
        private onResolution = (_resolved: boolean) => {}
    ) {
        super({
            target: {
                activePromptTitle: 'Choose character to bow or unbow',
                source: 'Water Ring',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardType: CardTypes.Character,
                cardCondition: gameMode === GameModes.Skirmish ? cardConditionSkirmish : cardConditionDefault
            }
        });
    }

    public executeHandler(context: AbilityContext) {
        if(!context.target) {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, 'water');
            this.onResolution(false);
            return;
        }
        if(context.target.bowed) {
            context.game.addMessage('{0} resolves the {1} ring, readying {2}', context.player, 'water', context.target);
            this.onResolution(true);
            context.game.addAnimation({ type: 'water', targetUuid: context.target.uuid, effect: 'ready' });
            context.game.applyGameAction(context, { ready: context.target });
        } else {
            context.game.addMessage('{0} resolves the {1} ring, bowing {2}', context.player, 'water', context.target);
            this.onResolution(true);
            context.game.addAnimation({ type: 'water', targetUuid: context.target.uuid, effect: 'bow' });
            context.game.applyGameAction(context, { bow: context.target });
        }
    }
}
