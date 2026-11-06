import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { gainAbility } from '../../../effects.js';
import { draw, gainHonor, sequential } from '../../../GameActions/GameActions.js';
import { ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class DesperateAide extends DrawCard {
    static id = 'desperate-aide';

    public override setupCardAbilities() {
        this.composure({
            effect: gainAbility.conflictAction('Draw a card', (ability) => ability
                .gameAction(sequential([
                    draw((context) => ({ target: context.player })),
                    gainHonor((context) => ({
                        amount: this.controllerHasHigherPol(context) ? 1 : 0,
                        target: context.player
                    }))
                ]))
                .chatText((context) => msg`draw 1 card${this.controllerHasHigherPol(context) ? ' and gain 1 honor' : ''}`))
        });
    }

    private controllerHasHigherPol(context: AbilityContext): boolean {
        if(!context.player.opponent) {
            return true;
        }
        const conflict = context.game.currentConflict;
        return !!conflict &&
            conflict.getCurrentSkill(context.player, ConflictType.Political) > conflict.getCurrentSkill(context.player.opponent, ConflictType.Political);
    }
}
