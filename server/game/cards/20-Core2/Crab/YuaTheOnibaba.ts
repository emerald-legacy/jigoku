import { msg } from '../../../GameChat.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect, multipleContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { Conflict } from '../../../Conflict.js';
import type Player from '../../../Player.js';

function charactersToBuffAndNerf(yuaController: Player, conflict: Conflict | null) {
    const res: { toBuff: DrawCard[]; toNerf: DrawCard[] } = {
        toBuff: [],
        toNerf: []
    };
    if(!conflict) {
        return res;
    }
    for(const character of conflict.getAttackers()) {
        if(!character.hasTrait('bushi')) {
            res.toNerf.push(character);
        } else if(character.controller === yuaController) {
            res.toBuff.push(character);
        }
    }
    for(const character of conflict.getDefenders()) {
        if(!character.hasTrait('bushi')) {
            res.toNerf.push(character);
        } else if(character.controller === yuaController) {
            res.toBuff.push(character);
        }
    }
    return res;
}

export default class YuaTheOnibaba extends DrawCard {
    static id = 'yua-the-onibaba';

    public setupCardAbilities() {
        this.conflictAction('Weaken non-bushi, empower bushi')
            .gameAction(multipleContext((context) => {
                const targets = charactersToBuffAndNerf(context.player, context.game.currentConflict);
                return {
                    gameActions: [
                        cardLastingEffect({
                            target: targets.toBuff,
                            effect: modifyBothSkills(1)
                        }),
                        cardLastingEffect({
                            target: targets.toNerf,
                            effect: modifyBothSkills(-1)
                        })
                    ]
                };
            }))
            .chatText(() => msg`give all friendly participating bushi characters +1${'military'} / +1${'political'} and give all participating non-bushi characters -1${'military'} / -1${'political'}`);
    }
}
